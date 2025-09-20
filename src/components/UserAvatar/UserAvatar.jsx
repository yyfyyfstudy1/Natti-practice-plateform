import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserAvatar.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../firebase/authService';

const UserAvatar = ({ onLoginClick }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      setShowDropdown(!showDropdown);
    } else {
      onLoginClick();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleClickOutside = () => {
    setShowDropdown(false);
  };

  const handleAdminAccess = () => {
    navigate('/admin');
    setShowDropdown(false);
  };

  // Get initials from user display name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Get user display name
  const getDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className={styles.container}>
      {isAuthenticated ? (
        <div className={styles.userSection}>
          <div 
            className={styles.avatar}
            onClick={handleAvatarClick}
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User Avatar" 
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarText}>
                {getInitials(getDisplayName())}
              </div>
            )}
          </div>
          
          {showDropdown && (
            <>
              <div 
                className={styles.overlay} 
                onClick={handleClickOutside}
              ></div>
              <div className={styles.dropdown}>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>
                    {getDisplayName()}
                  </div>
                  <div className={styles.userEmail}>
                    {user?.email}
                  </div>
                </div>
                <hr className={styles.divider} />
                {isAdmin && (
                  <>
                    <button 
                      className={styles.adminButton}
                      onClick={handleAdminAccess}
                    >
                      <span className={styles.adminIcon}>⚙️</span>
                      Admin Portal
                    </button>
                    <hr className={styles.divider} />
                  </>
                )}
                <button 
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  <span className={styles.logoutIcon}>🚪</span>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button 
          className={styles.loginButton}
          onClick={onLoginClick}
        >
          <span className={styles.loginIcon}>👤</span>
          Login
        </button>
      )}
    </div>
  );
};

export default UserAvatar;
