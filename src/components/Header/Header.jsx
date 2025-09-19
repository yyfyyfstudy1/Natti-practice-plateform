import React, { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('');

  // Filter options data
  const tagOptions = [
    { value: '', label: 'All Tags' },
    { value: 'housing', label: 'Housing' },
    { value: 'social-welfare', label: 'Social Welfare' },
    { value: 'legal', label: 'Legal' },
    { value: 'immigration', label: 'Immigration' },
    { value: 'medical', label: 'Medical' },
  ];

  const timeRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleTimeRangeChange = (e) => {
    setSelectedTimeRange(e.target.value);
  };

  const handleRandomQuestion = () => {
    // Handle random question functionality
    console.log('Random question clicked');
  };

  return (
    <header className={styles.header}>
      {/* Page title with cat icon */}
      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>
          <span className={styles.catIcon}>🐱</span>
          Question Sets
        </h1>
      </div>

      {/* Filter and search controls */}
      <div className={styles.controlsSection}>
        {/* Filter tag dropdown */}
        <div className={styles.filterGroup}>
          <select 
            value={selectedTag} 
            onChange={handleTagChange}
            className={styles.filterSelect}
          >
            {tagOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.filterIcon}>🔍</span>
        </div>

        {/* Time range filter dropdown */}
        <div className={styles.filterGroup}>
          <select 
            value={selectedTimeRange} 
            onChange={handleTimeRangeChange}
            className={styles.filterSelect}
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.filterIcon}>🕒</span>
        </div>

        {/* Search input */}
        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="Search conversation titles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        {/* Random question button */}
        <button 
          onClick={handleRandomQuestion}
          className={styles.randomButton}
        >
          <span className={styles.randomIcon}>🔄</span>
          Random Question
        </button>
      </div>
    </header>
  );
};

export default Header;
