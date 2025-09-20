import React, { useState, useEffect } from 'react';
import ContentItem from '../ContentItem/ContentItem';
import styles from './Content.module.css';
import { getQuestions, initializeMockData } from '../../firebase/questionService';
import { initializeQuestionDetailMockData } from '../../firebase/questionDetailService';

const Content = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // First try to initialize mock data (if database is empty)
        await initializeMockData();
        
        // Initialize question detail mock data
        await initializeQuestionDetailMockData();
        
        // Get questions data
        const questions = await getQuestions();
        
        // Transform data format to fit existing ContentItem component
        const formattedItems = questions.map((question) => ({
          id: question.id,
          title: question.questionTitle,
          category: question.category,
          isJiJing: question.isJiJing || false,
          questionDate: question.questionDate,
          updateTime: question.updateTime,
          uploadTime: question.uploadTime,
        }));
        
        setContentItems(formattedItems);
        
        // Set default selected to first item
        if (formattedItems.length > 0) {
          setSelectedItemId(formattedItems[0].id);
        }
        
      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load data, please refresh and try again');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

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
        {loading ? (
          <div className={styles.loadingMessage}>
            Loading data...
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            {error}
          </div>
        ) : contentItems.length === 0 ? (
          <div className={styles.emptyMessage}>
            No questions available
          </div>
        ) : (
          contentItems.map((item) => (
            <ContentItem
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={handleItemSelect}
              onToggleFavorite={handleToggleFavorite}
              onPlayAudio={handlePlayAudio}
            />
          ))
        )}
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
