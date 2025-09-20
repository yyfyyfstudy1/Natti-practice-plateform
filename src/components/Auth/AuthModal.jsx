import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import { loginUser, registerUser, resetPassword, getErrorMessage } from '../../firebase/authService';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        await loginUser(formData.email, formData.password);
        onClose();
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Password confirmation does not match');
          setLoading(false);
          return;
        }
        
        await registerUser(formData.email, formData.password, formData.displayName);
        onClose();
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(formData.email);
      setResetEmailSent(true);
      setError('');
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setResetEmailSent(false);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isLogin ? 'User Login' : 'User Registration'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="displayName" className={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter username"
                required={!isLogin}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter password"
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {resetEmailSent && (
            <div className={styles.success}>
              Password reset email has been sent, please check your inbox
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>

          <div className={styles.footer}>
            {isLogin ? (
              <>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>
                <span className={styles.separator}>|</span>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={toggleMode}
                >
                  Don't have an account? Register
                </button>
              </>
            ) : (
              <button
                type="button"
                className={styles.linkButton}
                onClick={toggleMode}
              >
                Already have an account? Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
