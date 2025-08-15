import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'ccoa_repo_history';

export const useRepoHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load repo history from localStorage", error);
    }
  }, []);

  const addRepoToHistory = useCallback((repoUrl) => {
    if (!repoUrl) return;

    setHistory(prevHistory => {
      // Avoid duplicates and limit history size
      const newHistory = [...new Set([repoUrl, ...prevHistory])].slice(0, 10);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save repo history to localStorage", error);
      }
      return newHistory;
    });
  }, []);

  return { history, addRepoToHistory };
};