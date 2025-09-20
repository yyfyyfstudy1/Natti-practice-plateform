import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { Readable } from 'node:stream';
import OpenAI from 'openai';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function synthesizeToStorage({ text, path }) {
  if (!text || !text.trim()) return null;
  const voiceModel = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
  const voiceName = process.env.OPENAI_TTS_VOICE || 'alloy';

  const response = await openai.audio.speech.create({
    model: voiceModel,
    voice: voiceName,
    input: text,
    format: 'mp3'
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

  await file.makePublic().catch(() => {});
  const publicUrl = `https://storage.googleapis.com/${file.bucket.name}/${encodeURIComponent(file.name)}`;
  return { gsUrl: `gs://${file.bucket.name}/${file.name}`, publicUrl };
}

export const onQuestionDetailWrite = functions.firestore
  .document('questionDetails/{docId}')
  .onWrite(async (change, context) => {
    const after = change.after.exists ? change.after.data() : null;
    if (!after) return;

    const docId = context.params.docId;
    const updates = {};

    if (after.introduction && !after.introductionAudio) {
      const path = `auto_audio/${docId}/introduction.mp3`;
      const audio = await synthesizeToStorage({ text: after.introduction, path });
      if (audio?.publicUrl) updates.introductionAudio = audio.publicUrl;
    }

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
      await db.collection('questionDetails').doc(docId).set(updates, { merge: true });
    }
  });

import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { Readable } from 'node:stream';
import OpenAI from 'openai';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function synthesizeToStorage({ text, path }) {
  if (!text || !text.trim()) return null;
  const voiceModel = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
  const voiceName = process.env.OPENAI_TTS_VOICE || 'alloy';

  const response = await openai.audio.speech.create({
    model: voiceModel,
    voice: voiceName,
    input: text,
    format: 'mp3'
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

  await file.makePublic().catch(() => {});
  const publicUrl = ;
  return { gsUrl: , publicUrl };
}

export const onQuestionDetailWrite = functions.firestore
  .document('questionDetails/{docId}')
  .onWrite(async (change, context) => {
    const after = change.after.exists ? change.after.data() : null;
    if (!after) return;

    const docId = context.params.docId;
    const updates = {};

    if (after.introduction && !after.introductionAudio) {
      const path = ;
      const audio = await synthesizeToStorage({ text: after.introduction, path });
      if (audio?.publicUrl) updates.introductionAudio = audio.publicUrl;
    }

    if (Array.isArray(after.dialogs)) {
      const newDialogs = await Promise.all(
        after.dialogs.map(async (dlg, idx) => {
          const updated = { ...dlg };
          if (dlg.originalText && !dlg.dialogAudio) {
            const path = ;
            const audio = await synthesizeToStorage({ text: dlg.originalText, path });
            if (audio?.publicUrl) updated.dialogAudio = audio.publicUrl;
          }
          if (dlg.translation && !dlg.translationAudio) {
            const path = ;
            const audio = await synthesizeToStorage({ text: dlg.translation, path });
            if (audio?.publicUrl) updated.translationAudio = audio.publicUrl;
          }
          return updated;
        })
      );
      updates.dialogs = newDialogs;
    }

    if (Object.keys(updates).length > 0) {
      await db.collection('questionDetails').doc(docId).set(updates, { merge: true });
    }
  });
