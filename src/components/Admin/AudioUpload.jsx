import React, { useState } from 'react';
import styles from './AudioUpload.module.css';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

const AudioUpload = ({ 
  onUploadComplete, 
  label = "Upload Audio",
  accept = "audio/*",
  folder = "audio",
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setFileName(file.name);
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setProgress(0);

      // Create a unique filename
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${folder}/${timestamp}_${cleanFileName}`;
      
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking
          const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progressPercent));
        },
        (error) => {
          // Error handling
          console.error('Upload error:', error);
          setError('Upload failed. Please try again.');
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            setProgress(100);
            
            if (onUploadComplete) {
              onUploadComplete({
                url: downloadURL,
                fileName: file.name,
                storagePath: storagePath,
                size: file.size,
                type: file.type
              });
            }
          } catch (error) {
            console.error('Error getting download URL:', error);
            setError('Failed to get file URL');
            setUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFileName('');
    setProgress(0);
    setError('');
    setUploading(false);
  };

  return (
    <div className={`${styles.uploadContainer} ${className}`}>
      <div className={styles.uploadArea}>
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className={styles.fileInput}
          id={`audio-upload-${Math.random()}`}
        />
        
        <label 
          htmlFor={`audio-upload-${Math.random()}`}
          className={`${styles.uploadLabel} ${uploading ? styles.disabled : ''}`}
        >
          <div className={styles.uploadIcon}>🎵</div>
          <div className={styles.uploadText}>
            {uploading ? 'Uploading...' : label}
          </div>
          {fileName && !uploading && (
            <div className={styles.fileName}>{fileName}</div>
          )}
        </label>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button type="button" onClick={resetUpload} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {/* Success State */}
      {progress === 100 && !uploading && !error && (
        <div className={styles.successMessage}>
          ✅ Upload completed successfully!
          <button type="button" onClick={resetUpload} className={styles.newUploadButton}>
            Upload Another
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
