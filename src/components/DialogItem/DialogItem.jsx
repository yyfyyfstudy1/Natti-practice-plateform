import React, { useState } from 'react';
import styles from './DialogItem.module.css';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

const DialogItem = ({ 
  dialog, 
  dialogNumber,
  showTranslation = false 
}) => {
  const [isTranslationVisible, setIsTranslationVisible] = useState(showTranslation);

  const toggleTranslation = () => {
    setIsTranslationVisible(!isTranslationVisible);
  };

  return (
    <div className={styles.dialogItem}>
      {/* Dialog Header */}
      <div className={styles.dialogHeader}>
        <div className={styles.dialogTitle}>
          <span className={styles.dialogNumber}>Dialog {dialogNumber}</span>
          <button 
            className={styles.favoriteButton}
            title="Add to favorites"
          >
            <span className={styles.favoriteIcon}>♡</span>
          </button>
          <button 
            className={styles.menuButton}
            title="More options"
          >
            <span className={styles.menuIcon}>⋯</span>
          </button>
        </div>
      </div>

      {/* Original Text Section */}
      <div className={styles.textSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Original</span>
          <div className={styles.sectionActions}>
            <button 
              className={styles.copyButton}
              title="Copy text"
            >
              <span className={styles.copyIcon}>📋</span>
            </button>
            <button 
              className={styles.hideButton}
              title="Hide section"
            >
              Hide
            </button>
          </div>
        </div>
        
        <p className={styles.originalText}>
          {dialog.originalText}
        </p>
        
        <AudioPlayer 
          audioSrc={dialog.dialogAudio}
          className={styles.audioPlayer}
        />
      </div>

      {/* Translation Section */}
      <div className={styles.textSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Reference Translation</span>
          <div className={styles.sectionActions}>
            <button 
              className={styles.toggleButton}
              onClick={toggleTranslation}
              title={isTranslationVisible ? "Hide translation" : "Show translation"}
            >
              {isTranslationVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        
        {isTranslationVisible && (
          <>
            <p className={styles.translationText}>
              {dialog.translation}
            </p>
            
            <AudioPlayer 
              audioSrc={dialog.translationAudio}
              className={styles.audioPlayer}
            />
          </>
        )}
      </div>

      {/* Recording Section */}
      <div className={styles.recordingSection}>
        <button className={styles.recordButton}>
          <span className={styles.recordIcon}>🎤</span>
          Start Recording
        </button>
      </div>
    </div>
  );
};

export default DialogItem;
