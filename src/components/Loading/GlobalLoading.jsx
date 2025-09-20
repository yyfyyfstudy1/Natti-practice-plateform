import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';
import styles from './GlobalLoading.module.css';

const GlobalLoading = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.spinner}>
        <div className={styles.circle} />
        <div className={styles.text}>Loading...</div>
      </div>
    </div>
  );
};

export default GlobalLoading;


