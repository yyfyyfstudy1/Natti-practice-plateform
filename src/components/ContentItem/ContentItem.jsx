import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ContentItem.module.css';

const ContentItem = ({ 
  item, 
  isSelected = false, 
  onSelect, 
  onToggleFavorite, 
  onPlayAudio 
}) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    category,
    isJiJing = false,
  } = item;

  // Handle item selection
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
    // Navigate to question detail page
    navigate(`/question/${id}`);
  };


  // Handle audio play
  const handleAudioPlay = (e) => {
    e.stopPropagation(); // Prevent item selection
    if (onPlayAudio) {
      onPlayAudio(id);
    }
  };

  // Get category display name and color
  const getCategoryInfo = (category) => {
    const categoryMap = {
      'housing': { label: 'Housing', color: '#28a745' },
      'social-welfare': { label: 'Social Welfare', color: '#17a2b8' },
      'legal': { label: 'Legal', color: '#ffc107' },
      'immigration': { label: 'Immigration', color: '#fd7e14' },
      'medical': { label: 'Medical', color: '#6f42c1' },
    };
    return categoryMap[category] || { label: category, color: '#6c757d' };
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div 
      className={`${styles.contentItem} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      {/* Item number */}
      <div className={styles.itemNumber}>
        {id.toString().padStart(4, '0')}
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Title */}
        <h3 className={styles.itemTitle}>{title}</h3>
        
        {/* Category tag */}
        <span 
          className={styles.categoryTag}
          style={{ backgroundColor: categoryInfo.color }}
        >
          {categoryInfo.label}
        </span>
      </div>

      {/* Status and action buttons */}
      <div className={styles.actions}>
        {/* Ji Jing status */}
        {isJiJing && (
          <span className={styles.jiJing}>
            Exam Tips
          </span>
        )}

        {/* Login prompt */}
        <span className={styles.loginPrompt}>
          Login to view details
        </span>

        {/* Audio play button */}
        <button 
          className={styles.audioButton}
          onClick={handleAudioPlay}
          title="Play audio"
        >
          <span className={styles.audioIcon}>🎧</span>
        </button>
      </div>
    </div>
  );
};

export default ContentItem;
