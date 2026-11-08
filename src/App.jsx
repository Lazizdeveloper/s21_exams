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
import CPracticePage from './pages/CPracticePage';

function AppContent() {
  const { currentView } = useApp();
  const isCIdeMode = currentView === 'c_practice';

  return (
    <div className={`flex flex-col ${isCIdeMode ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Navbar />
      {isCIdeMode ? (
        <main className="flex-1 w-full h-[calc(100vh-65px)] overflow-hidden">
          <CPracticePage />
        </main>
      ) : (
        <>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {currentView === 'home' && <HomePage />}
            {currentView === 'practice' && <PracticePage />}
            {currentView === 'exam' && <ExamPage />}
            {currentView === 'exam_result' && <ExamResultPage />}
            {currentView === 'catalog' && <BrowseCatalogPage />}
            {currentView === 'bookmarks' && <BookmarksPage />}
          </main>
          <Footer />
        </>
      )}
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
