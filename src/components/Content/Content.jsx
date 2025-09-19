import React, { useState } from 'react';
import ContentItem from '../ContentItem/ContentItem';
import styles from './Content.module.css';

const Content = () => {
  const [selectedItemId, setSelectedItemId] = useState(3); // Default to item 3 as shown in the image

  // Sample data - in a real app, this would come from props or API
  const contentItems = [
    {
      id: 1,
      title: 'Build a House',
      category: 'housing',
      isLearned: false,
      isJiJing: false,
      isFavorite: false,
    },
    {
      id: 2,
      title: 'Domestic Violence',
      category: 'social-welfare',
      isLearned: false,
      isJiJing: false,
      isFavorite: false,
    },
    {
      id: 3,
      title: 'Domestic Violence Legal',
      category: 'legal',
      isLearned: false,
      isJiJing: false,
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Australian Immigration',
      category: 'immigration',
      isLearned: true,
      isJiJing: true,
      isFavorite: true,
    },
    {
      id: 5,
      title: 'Medical Emergency',
      category: 'medical',
      isLearned: false,
      isJiJing: false,
      isFavorite: false,
    },
    {
      id: 6,
      title: 'Housing Application',
      category: 'housing',
      isLearned: true,
      isJiJing: false,
      isFavorite: false,
    },
    {
      id: 7,
      title: 'Social Welfare Benefits',
      category: 'social-welfare',
      isLearned: false,
      isJiJing: true,
      isFavorite: false,
    },
    {
      id: 8,
      title: 'Legal Consultation',
      category: 'legal',
      isLearned: true,
      isJiJing: false,
      isFavorite: true,
    },
    {
      id: 9,
      title: 'Immigration Process',
      category: 'immigration',
      isLearned: false,
      isJiJing: false,
      isFavorite: false,
    },
    {
      id: 10,
      title: 'Medical Check-up',
      category: 'medical',
      isLearned: true,
      isJiJing: true,
      isFavorite: false,
    },
  ];

  // Handle item selection
  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (itemId) => {
    // In a real app, this would update the backend
    console.log(`Toggle favorite for item ${itemId}`);
  };

  // Handle audio play
  const handlePlayAudio = (itemId) => {
    // In a real app, this would start audio playback
    console.log(`Play audio for item ${itemId}`);
  };

  return (
    <main className={styles.content}>
      {/* Content list */}
      <div className={styles.contentList}>
        {contentItems.map((item) => (
          <ContentItem
            key={item.id}
            item={item}
            isSelected={selectedItemId === item.id}
            onSelect={handleItemSelect}
            onToggleFavorite={handleToggleFavorite}
            onPlayAudio={handlePlayAudio}
          />
        ))}
      </div>

      {/* Background decoration - cat avatar */}
      <div className={styles.backgroundDecoration}>
        <div className={styles.catAvatar}>🐱</div>
      </div>

      {/* URL link at bottom left */}
      <div className={styles.urlLink}>
        <a 
          href="https://cclcat.com/dialogs/dbcb2c4a-7bcf-11ef-b18c-2b33599081a8?"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          https://cclcat.com/dialogs/dbcb2c4a-7bcf-11ef-b18c-2b33599081a8?
        </a>
      </div>
    </main>
  );
};

export default Content;
