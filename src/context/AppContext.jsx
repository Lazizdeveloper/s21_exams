import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('s21_lang') || 'uz';
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('s21_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam) return viewParam;
    }
    return 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeExamResult, setActiveExamResult] = useState(null);

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('s21_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [examHistory, setExamHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('s21_exam_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('s21_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('s21_lang', newLang);
  };

  const toggleBookmark = (questionId) => {
    setBookmarks(prev => {
      const next = prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId];
      localStorage.setItem('s21_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (questionId) => bookmarks.includes(questionId);

  const saveExamResult = (result) => {
    const entry = {
      ...result,
      id: Date.now(),
      date: new Date().toISOString()
    };
    setExamHistory(prev => {
      const next = [entry, ...prev].slice(0, 50);
      localStorage.setItem('s21_exam_history', JSON.stringify(next));
      return next;
    });
    setActiveExamResult(entry);
    setCurrentView('exam_result');
  };

  const t = translations[lang] || translations.uz;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        toggleTheme,
        t,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        examHistory,
        saveExamResult,
        activeExamResult,
        setActiveExamResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
