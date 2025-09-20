import React, { createContext, useContext, useMemo, useRef, useState, useCallback } from 'react';

const LoadingContext = createContext(null);

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
};

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;
  const counterRef = useRef(0);

  const start = useCallback(() => {
    counterRef.current += 1;
    setLoadingCount(counterRef.current);
  }, []);

  const stop = useCallback(() => {
    counterRef.current = Math.max(0, counterRef.current - 1);
    setLoadingCount(counterRef.current);
  }, []);

  const withLoading = useCallback(async (fn) => {
    start();
    try {
      return await fn();
    } finally {
      stop();
    }
  }, [start, stop]);

  const value = useMemo(() => ({ isLoading, start, stop, withLoading }), [isLoading, start, stop, withLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};


