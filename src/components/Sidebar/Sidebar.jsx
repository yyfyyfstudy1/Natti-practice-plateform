import React, { useState } from 'react';
import styles from './Sidebar.module.css';

// Navigation menu items data
const menuItems = [
  { id: 'home', label: 'Home', icon: '🏠', active: false },
  { id: 'questions', label: 'Question Sets', icon: '🎓', active: true },
  { id: 'audio', label: 'Audio Player', icon: '🎧', active: false },
  { id: 'favorites', label: 'Favorites', icon: '📁', active: false },
  { id: 'help', label: 'Help & Guide', icon: '📚', active: false },
  { id: 'account', label: 'Account', icon: '👤', active: false },
  { id: 'feedback', label: 'Feedback', icon: '💬', active: false },
  { id: 'plus', label: 'Cat Plus', icon: '¥', active: false },
];

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle toggle sidebar
  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Notify parent component about sidebar state change
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* Menu toggle button */}
      <div className={styles.menuToggle}>
        <button 
          className={styles.menuButton}
          onClick={handleToggle}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <span className={styles.menuIcon}>
            {isCollapsed ? '→' : '☰'}
          </span>
        </button>
      </div>

      {/* Navigation menu */}
      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button 
                className={`${styles.menuButton} ${item.active ? styles.active : ''}`}
                title={item.label}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
