import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import ExamPage from './pages/ExamPage';
import ExamResultPage from './pages/ExamResultPage';
import BrowseCatalogPage from './pages/BrowseCatalogPage';
import BookmarksPage from './pages/BookmarksPage';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' && <HomePage />}
        {currentView === 'practice' && <PracticePage />}
        {currentView === 'exam' && <ExamPage />}
        {currentView === 'exam_result' && <ExamResultPage />}
        {currentView === 'catalog' && <BrowseCatalogPage />}
        {currentView === 'bookmarks' && <BookmarksPage />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
