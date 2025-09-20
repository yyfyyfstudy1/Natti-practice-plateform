import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { Readable } from 'node:stream';
import OpenAI from 'openai';

initializeApp();
const db = getFirestore();
const storage = getStorage();

// Load OpenAI API Key from Firebase Functions environment configuration
// Use functions.config() for secrets set via `firebase functions:config:set`
// Or use process.env for secrets set via `firebase functions:secrets:set`
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/**
 * Generate speech audio from plain text using OpenAI (TTS).
 * Saves to Firebase Storage and returns the gs:// and https URLs.
 */
async function synthesizeToStorage({ text, path }) {
  if (!text || !text.trim() || !openai) return null;

  // Choose a high-quality TTS model; fallback name if env not provided
  const voiceModel = process.env.OPENAI_TTS_MODEL || 'tts-1'; // Changed to tts-1 for broader availability
  const voiceName = process.env.OPENAI_TTS_VOICE || 'alloy';

  try {
    const response = await openai.audio.speech.create({
      model: voiceModel,
      voice: voiceName,
      input: text,
      response_format: 'mp3' // Ensure mp3 format
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = storage.bucket();
    const file = bucket.file(path);

    await new Promise((resolve, reject) => {
      const rs = Readable.from(buffer);
      const ws = file.createWriteStream({
        metadata: { contentType: 'audio/mpeg' },
        resumable: false
      });
      rs.pipe(ws).on('finish', resolve).on('error', reject);
    });

    await file.makePublic().catch(() => {}); // Make file public
    const publicUrl = `https://storage.googleapis.com/${file.bucket.name}/${encodeURIComponent(file.name)}`;
    return { gsUrl: `gs://${file.bucket.name}/${file.name}`, publicUrl };
  } catch (error) {
    console.error(`Error synthesizing audio for path ${path}:`, error);
    return null;
  }
}

/**
 * Firestore trigger for questionDetails collection.
 * On create or update, auto-generate audio for introduction and each dialog text
 * if corresponding audio URLs are empty.
 */
export const onQuestionDetailWrite = onDocumentWritten(
  'questionDetails/{docId}',
  async (event) => {
    const { data: after } = event;
    if (!after) return; // Document deleted

    const docId = event.params.docId;
    const updates = {};

    // Intro audio
    if (after.introduction && !after.introductionAudio) {
      const path = `auto_audio/${docId}/introduction.mp3`;
      const audio = await synthesizeToStorage({ text: after.introduction, path });
      if (audio?.publicUrl) updates.introductionAudio = audio.publicUrl;
    }

    // Dialogs
    if (Array.isArray(after.dialogs)) {
      const newDialogs = await Promise.all(
        after.dialogs.map(async (dlg, idx) => {
          const updated = { ...dlg };
          if (dlg.originalText && !dlg.dialogAudio) {
            const path = `auto_audio/${docId}/dialog_${idx + 1}_original.mp3`;
            const audio = await synthesizeToStorage({ text: dlg.originalText, path });
            if (audio?.publicUrl) updated.dialogAudio = audio.publicUrl;
          }
          if (dlg.translation && !dlg.translationAudio) {
            const path = `auto_audio/${docId}/dialog_${idx + 1}_translation.mp3`;
            const audio = await synthesizeToStorage({ text: dlg.translation, path });
            if (audio?.publicUrl) updated.translationAudio = audio.publicUrl;
          }
          return updated;
        })
      );
      updates.dialogs = newDialogs;
    }

    if (Object.keys(updates).length > 0) {
      console.log(`Updating questionDetails/${docId} with auto-generated audio URLs.`);
      await db.collection('questionDetails').doc(docId).set(updates, { merge: true });
    }
  }
);

/**
 * HTTPS Callable: Generate audio on demand for admin.
 * Request data:
 *  - docId?: string
 *  - introduction?: string
 *  - dialogs?: Array<{ id: string, originalText?: string, translation?: string }>
 * Response data:
 *  - introductionAudio?: string | null
 *  - dialogs?: Array<{ id: string, dialogAudio?: string|null, translationAudio?: string|null }>
 */
export const ttsGenerateForQuestion = onCall(async (request) => {
  if (!openai) {
    throw new HttpsError('failed-precondition', 'OPENAI_API_KEY is not configured.');
  }
  const data = request.data || {};
  const docId = typeof data.docId === 'string' && data.docId.trim() ? data.docId.trim() : `manual_${Date.now()}`;
  const introduction = typeof data.introduction === 'string' ? data.introduction : '';
  const dialogs = Array.isArray(data.dialogs) ? data.dialogs : [];

  try {
    const result = { introductionAudio: null, dialogs: [] };

    if (introduction && introduction.trim()) {
      const introPath = `auto_audio/${docId}/introduction.mp3`;
      const introAudio = await synthesizeToStorage({ text: introduction, path: introPath });
      result.introductionAudio = introAudio?.publicUrl || null;
    }

    if (dialogs.length > 0) {
      result.dialogs = await Promise.all(
        dialogs.map(async (dlg, idx) => {
          const item = { id: dlg.id };
          if (dlg.originalText && dlg.originalText.trim()) {
            const p = `auto_audio/${docId}/dialog_${idx + 1}_original.mp3`;
            const a = await synthesizeToStorage({ text: dlg.originalText, path: p });
            item.dialogAudio = a?.publicUrl || null;
          } else {
            item.dialogAudio = null;
          }
          if (dlg.translation && dlg.translation.trim()) {
            const p2 = `auto_audio/${docId}/dialog_${idx + 1}_translation.mp3`;
            const a2 = await synthesizeToStorage({ text: dlg.translation, path: p2 });
            item.translationAudio = a2?.publicUrl || null;
          } else {
            item.translationAudio = null;
          }
          return item;
        })
      );
    }

    return result;
  } catch (err) {
    console.error('ttsGenerateForQuestion error:', err);
    throw new HttpsError('internal', 'Failed to generate audio');
  }
});