import React, { useState } from 'react';
import styles from './DialogManager.module.css';
import AudioUpload from './AudioUpload';

const DialogManager = ({ dialogs = [], onDialogsChange }) => {
  const [expandedDialog, setExpandedDialog] = useState(null);

  const addNewDialog = () => {
    const newDialog = {
      id: `dialog_${Date.now()}`,
      originalText: '',
      dialogAudio: '',
      translation: '',
      translationAudio: ''
    };
    
    onDialogsChange([...dialogs, newDialog]);
    setExpandedDialog(newDialog.id);
  };

  const updateDialog = (dialogId, field, value) => {
    const updatedDialogs = dialogs.map(dialog => 
      dialog.id === dialogId 
        ? { ...dialog, [field]: value }
        : dialog
    );
    onDialogsChange(updatedDialogs);
  };

  const removeDialog = (dialogId) => {
    const updatedDialogs = dialogs.filter(dialog => dialog.id !== dialogId);
    onDialogsChange(updatedDialogs);
    setExpandedDialog(null);
  };

  const toggleExpanded = (dialogId) => {
    setExpandedDialog(expandedDialog === dialogId ? null : dialogId);
  };

  const handleAudioUpload = (dialogId, audioType, uploadResult) => {
    updateDialog(dialogId, audioType, uploadResult.url);
  };

  return (
    <div className={styles.dialogManager}>
      <div className={styles.header}>
        <h3 className={styles.title}>Dialogs</h3>
        <button 
          type="button"
          onClick={addNewDialog}
          className={styles.addButton}
        >
          + Add Dialog
        </button>
      </div>

      {dialogs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No dialogs yet. Click "Add Dialog" to get started.</p>
        </div>
      ) : (
        <div className={styles.dialogList}>
          {dialogs.map((dialog, index) => (
            <div key={dialog.id} className={styles.dialogCard}>
              <div className={styles.dialogHeader}>
                <div className={styles.dialogInfo}>
                  <span className={styles.dialogNumber}>
                    Dialog {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(dialog.id)}
                    className={styles.expandButton}
                  >
                    {expandedDialog === dialog.id ? '▼' : '▶'}
                  </button>
                </div>
                <div className={styles.dialogActions}>
                  <button
                    type="button"
                    onClick={() => removeDialog(dialog.id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {expandedDialog === dialog.id && (
                <div className={styles.dialogContent}>
                  {/* Original Text */}
                  <div className={styles.textSection}>
                    <label className={styles.label}>
                      Original Text (English)
                    </label>
                    <textarea
                      value={dialog.originalText}
                      onChange={(e) => updateDialog(dialog.id, 'originalText', e.target.value)}
                      placeholder="Enter the original English text..."
                      className={styles.textarea}
                      rows={3}
                    />
                    
                    <div className={styles.audioSection}>
                      <span className={styles.audioLabel}>Original Audio:</span>
                      <AudioUpload
                        onUploadComplete={(result) => handleAudioUpload(dialog.id, 'dialogAudio', result)}
                        label="Upload Original Audio"
                        folder={`audio/dialogs/original`}
                        className={styles.audioUpload}
                      />
                      {dialog.dialogAudio && (
                        <div className={styles.audioPreview}>
                          <audio controls src={dialog.dialogAudio} className={styles.audioPlayer}>
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Translation */}
                  <div className={styles.textSection}>
                    <label className={styles.label}>
                      Translation (Chinese)
                    </label>
                    <textarea
                      value={dialog.translation}
                      onChange={(e) => updateDialog(dialog.id, 'translation', e.target.value)}
                      placeholder="Enter the Chinese translation..."
                      className={styles.textarea}
                      rows={3}
                    />
                    
                    <div className={styles.audioSection}>
                      <span className={styles.audioLabel}>Translation Audio:</span>
                      <AudioUpload
                        onUploadComplete={(result) => handleAudioUpload(dialog.id, 'translationAudio', result)}
                        label="Upload Translation Audio"
                        folder={`audio/dialogs/translation`}
                        className={styles.audioUpload}
                      />
                      {dialog.translationAudio && (
                        <div className={styles.audioPreview}>
                          <audio controls src={dialog.translationAudio} className={styles.audioPlayer}>
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DialogManager;
