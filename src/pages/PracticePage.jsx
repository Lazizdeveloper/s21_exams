import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  RotateCcw, 
  Shuffle,
  HelpCircle, 
  Check, 
  X, 
  LayoutGrid, 
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, normalizeQuestion, getRandomQuestions } from '../data/categories';
import MarkdownView from '../components/MarkdownView';

export default function PracticePage() {
  const { lang, t, selectedCategory, setSelectedCategory, setCurrentView, toggleBookmark, isBookmarked } = useApp();

  // If no category selected, default to DevOps
  const currentCategory = selectedCategory || CATEGORIES[0];
  const [sessionKey, setSessionKey] = useState(0);

  // Pick 30 random questions for this practice session
  const rawSessionQuestions = useMemo(() => {
    return getRandomQuestions(
      currentCategory.rawQuestions, 
      currentCategory.practiceQuestionCount || 30
    );
  }, [currentCategory.id, sessionKey]);

  // Translate to current language without losing current question set
  const questions = useMemo(() => {
    return rawSessionQuestions.map(q => 
      normalizeQuestion(q, lang, currentCategory.id)
    );
  }, [rawSessionQuestions, lang, currentCategory.id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionId or array }
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // { [questionIndex]: true }
  const [showExplanation, setShowExplanation] = useState({});
  const [isGridOpen, setIsGridOpen] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  // Determine multi-choice properties
  const correctOptions = useMemo(() => {
    return currentQ?.options?.filter(o => o.is_correct) || [];
  }, [currentQ]);
  const correctCount = Math.max(1, correctOptions.length);
  const isMulti = currentQ?.type === 'checkbox' || correctOptions.length > 1;

  const currentSelection = userAnswers[currentIndex];
  const isSubmitted = !!submittedQuestions[currentIndex];
  const hasAnswered = isSubmitted;

  const hasSelection = Array.isArray(currentSelection)
    ? currentSelection.length > 0
    : currentSelection !== undefined;

  const selectedList = useMemo(() => {
    if (Array.isArray(currentSelection)) return currentSelection;
    if (currentSelection !== undefined) return [currentSelection];
    return [];
  }, [currentSelection]);
  const selectedCount = selectedList.length;

  const handleSelectOption = (optId) => {
    // If already evaluated, lock selection
    if (isSubmitted) return;

    if (isMulti) {
      const current = Array.isArray(currentSelection) ? currentSelection : [];
      const next = current.includes(optId)
        ? current.filter(id => id !== optId)
        : [...current, optId];
      setUserAnswers(prev => ({ ...prev, [currentIndex]: next }));
    } else {
      // Single choice: select option only, DO NOT evaluate immediately
      setUserAnswers(prev => ({ ...prev, [currentIndex]: optId }));
    }
  };

  const handleEvaluateCurrent = () => {
    if (isSubmitted || !hasSelection) return;
    setSubmittedQuestions(prev => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    // If user has selected option(s) and not yet evaluated, evaluate first
    if (hasSelection && !isSubmitted) {
      setSubmittedQuestions(prev => ({ ...prev, [currentIndex]: true }));
      return;
    }

    // If already evaluated or skipped, proceed to next question
    if (!isLast) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentIndex(prev => prev - 1);
  };

  const handleShuffleNew = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
    setShowExplanation({});
    setCurrentIndex(0);
    setSessionKey(prev => prev + 1);
  };

  const handleReset = () => {
    if (window.confirm("Barcha javoblarni tozalab, yangi 30 ta tasodifiy savol bilan qaytadan boshlamoqchimisiz?")) {
      handleShuffleNew();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Category Switcher & Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t.actions.backHome}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.practice.title}: {t.categories[currentCategory.key]?.title || currentCategory.id}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {questions.length} ta tasodifiy savol (Jami: {currentCategory.totalQuestions} ta)
            </p>
          </div>
        </div>

        {/* Category selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setUserAnswers({});
                setShowExplanation({});
                setSessionKey(prev => prev + 1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                cat.id === currentCategory.id
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Navigator Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {t.practice.questionNumber} {currentIndex + 1} / {questions.length}
          </span>
          <button
            type="button"
            onClick={() => setIsGridOpen(!isGridOpen)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LayoutGrid size={14} />
            <span>Savollar jadvali</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShuffleNew}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
            title="Yangi 30 ta tasodifiy savol olish"
          >
            <Shuffle size={16} />
            <span className="hidden sm:inline">Aralashtirish (30 ta)</span>
          </button>

          <button
            type="button"
            onClick={() => toggleBookmark(currentQ.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isBookmarked(currentQ.id)
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={t.actions.bookmark}
          >
            <Star size={18} className={isBookmarked(currentQ.id) ? 'fill-amber-500' : ''} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title={t.actions.restart}
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Question Navigator Grid Drawer */}
      {isGridOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tezkor o'tish</span>
            <button
              type="button"
              onClick={() => setIsGridOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Yopish ✕
            </button>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 max-h-48 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const ans = userAnswers[idx];
              const isSub = !!submittedQuestions[idx];
              const isCurr = idx === currentIndex;
              let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

              if (isSub && ans !== undefined) {
                const qCorrectIds = q.options.filter(o => o.is_correct).map(o => o.id);
                const qIsMulti = q.type === 'checkbox' || qCorrectIds.length > 1;
                let isCorr = false;

                if (qIsMulti) {
                  const userSel = Array.isArray(ans) ? ans : [];
                  isCorr = userSel.length === qCorrectIds.length && userSel.every(id => qCorrectIds.includes(id));
                } else {
                  isCorr = q.options.find(o => o.id === ans)?.is_correct;
                }

                bg = isCorr
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-rose-500 text-white font-bold';
              } else if (!isSub && ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : true)) {
                bg = 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsGridOpen(false);
                  }}
                  className={`h-7 rounded text-xs transition-all ${bg} ${
                    isCurr ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 font-bold scale-110 z-10' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Question Header & Prompt */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="text-emerald-600 dark:text-emerald-400">{currentCategory.id.toUpperCase()}</span>
            <span className="text-slate-400">•</span>
            {isMulti ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold">
                {t.practice.selectMultiple}
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">{t.practice.selectOption}</span>
            )}
          </div>

          {/* User Request Notice Banner: bu savolning javobi 1 va undan ortiq bolishi mumkin */}
          {isMulti && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold animate-fadeIn">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
              <span>{t.practice.multiNotice}</span>
            </div>
          )}

          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed pt-1">
            <MarkdownView content={currentQ.question} />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = isMulti
              ? Array.isArray(currentSelection) && currentSelection.includes(opt.id)
              : currentSelection === opt.id;

            // Colors after selection / submission
            let containerStyle = 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 bg-white dark:bg-slate-900';
            let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

            if (hasAnswered) {
              if (opt.is_correct) {
                containerStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                badgeStyle = 'bg-emerald-500 text-white font-bold';
              } else if (isSelected && !opt.is_correct) {
                containerStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                badgeStyle = 'bg-rose-500 text-white font-bold';
              }
            } else if (isSelected) {
              containerStyle = 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-slate-900 dark:text-white shadow-sm ring-1 ring-emerald-500/40';
              badgeStyle = 'bg-emerald-500 text-white font-bold';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none ${containerStyle}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${badgeStyle}`}>
                  {hasAnswered && opt.is_correct ? (
                    <Check size={16} />
                  ) : hasAnswered && isSelected && !opt.is_correct ? (
                    <X size={16} />
                  ) : !hasAnswered && isSelected ? (
                    <Check size={16} />
                  ) : (
                    opt.key
                  )}
                </div>

                <div className="flex-1 text-sm sm:text-base leading-relaxed pt-0.5">
                  <MarkdownView content={opt.text} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button inside Question Card */}
        {!isSubmitted && hasSelection && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isMulti ? (
                selectedCount < correctCount ? (
                  <span>Yana <strong className="text-amber-500">{correctCount - selectedCount}</strong> ta variant tanlang ({selectedCount}/{correctCount})</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ {selectedCount} ta javob tanlandi. Tekshirishga tayyor.</span>
                )
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Variant tanlandi. Tekshirish uchun "Keyingi" yoki "Tekshirish"ni bosing.</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleEvaluateCurrent}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{isMulti && selectedCount >= correctCount ? "Davom etish" : (t.actions.checkAnswer || "Tekshirish")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Explanation Box */}
        {hasAnswered && currentQ.explanation && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm space-y-1 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <HelpCircle size={16} />
              <span>{t.practice.explanation}</span>
            </div>
            <p className="leading-relaxed pl-6">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
            isFirst
              ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
              : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          <ChevronLeft size={18} />
          <span>{t.actions.prev}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
            isLast && isSubmitted
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95'
          }`}
        >
          <span>
            {hasSelection && !isSubmitted
              ? (t.actions.checkAnswer || "Tekshirish")
              : isLast
                ? t.actions.submit
                : t.actions.next}
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
