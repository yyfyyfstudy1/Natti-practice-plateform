import React, { useState, useRef, useEffect } from 'react';
import styles from './AudioPlayer.module.css';

const AudioPlayer = ({ 
  audioSrc, 
  className = '', 
  showTime = true,
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime || 0);
    
    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioSrc]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsLoading(false);
      });
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const progressWidth = progressBar.offsetWidth;
    const newTime = (clickX / progressWidth) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`${styles.audioPlayer} ${className}`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        autoPlay={autoPlay}
      />
      
      <button
        className={styles.playButton}
        onClick={togglePlayPause}
        disabled={!audioSrc || isLoading}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? (
          <span className={styles.loadingIcon}>⟳</span>
        ) : isPlaying ? (
          <span className={styles.pauseIcon}>⏸</span>
        ) : (
          <span className={styles.playIcon}>▶</span>
        )}
      </button>

      <div className={styles.progressContainer}>
        {showTime && (
          <span className={styles.timeDisplay}>
            {formatTime(currentTime)}
          </span>
        )}
        
        <div
          className={styles.progressBar}
          onClick={handleProgressClick}
        >
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {showTime && (
          <span className={styles.timeDisplay}>
            {formatTime(duration)}
          </span>
        )}
      </div>

      <button
        className={styles.menuButton}
        title="Audio options"
      >
        <span className={styles.menuIcon}>⋯</span>
      </button>
    </div>
  );
};

export default AudioPlayer;
