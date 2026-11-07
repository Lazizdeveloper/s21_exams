import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  ArrowLeft, 
  LayoutGrid 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, normalizeQuestion, getRandomQuestions } from '../data/categories';
import MarkdownView from '../components/MarkdownView';

export default function ExamPage() {
  const { lang, t, selectedCategory, setCurrentView, saveExamResult } = useApp();

  const currentCategory = selectedCategory || CATEGORIES[0];

  // Pick 30 random questions for this exam session
  const rawExamQuestions = useMemo(() => {
    return getRandomQuestions(
      currentCategory.rawQuestions, 
      currentCategory.examQuestionCount || 30
    );
  }, [currentCategory.id]);

  // Translate/normalize to active language without altering question set
  const examQuestions = useMemo(() => {
    return rawExamQuestions.map(q => 
      normalizeQuestion(q, lang, currentCategory.id)
    );
  }, [rawExamQuestions, lang, currentCategory.id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qIndex]: optionId or array }
  const [secondsRemaining, setSecondsRemaining] = useState(() => currentCategory.examDurationMinutes * 60);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleAutoFinish();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = examQuestions[currentIndex] || examQuestions[0];
  const isLast = currentIndex === examQuestions.length - 1;
  const isFirst = currentIndex === 0;

  const currentSelection = userAnswers[currentIndex];
  const answeredCount = Object.keys(userAnswers).filter(k => {
    const val = userAnswers[k];
    return Array.isArray(val) ? val.length > 0 : val !== undefined;
  }).length;

  const handleSelectOption = (optId) => {
    if (currentQ.type === 'checkbox') {
      const current = Array.isArray(currentSelection) ? currentSelection : [];
      const next = current.includes(optId)
        ? current.filter(id => id !== optId)
        : [...current, optId];
      setUserAnswers(prev => ({ ...prev, [currentIndex]: next }));
    } else {
      setUserAnswers(prev => ({ ...prev, [currentIndex]: optId }));
    }
  };

  const handleFinish = () => {
    let correctCount = 0;
    const reviewData = examQuestions.map((q, idx) => {
      const ans = userAnswers[idx];
      let isCorrect = false;

      if (q.type === 'checkbox') {
        const userSelected = Array.isArray(ans) ? ans : [];
        const correctIds = q.options.filter(o => o.is_correct).map(o => o.id);
        isCorrect = userSelected.length === correctIds.length &&
          userSelected.every(id => correctIds.includes(id));
      } else {
        const correctOpt = q.options.find(o => o.is_correct);
        isCorrect = correctOpt && ans === correctOpt.id;
      }

      if (isCorrect) correctCount++;

      return {
        question: q,
        userSelection: ans,
        isCorrect
      };
    });

    const total = examQuestions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passingScorePercent = currentCategory.passingScorePercent || (currentCategory.id === 'devops' ? 80 : 50);
    const passed = percentage >= passingScorePercent;
    const timeSpentSeconds = (currentCategory.examDurationMinutes * 60) - secondsRemaining;

    saveExamResult({
      categoryKey: currentCategory.key,
      categoryTitle: t.categories[currentCategory.key]?.title || currentCategory.id,
      totalQuestions: total,
      correctCount,
      incorrectCount: total - correctCount,
      percentage,
      passingScorePercent,
      passed,
      timeSpentSeconds,
      reviewData
    });
  };

  const handleAutoFinish = () => {
    alert("Vaqt tugadi! Imtihon natijalari hisoblanmoqda...");
    handleFinish();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Sticky Exam Timer Header */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Imtihondan chiqmoqchimisiz? Natijalar saqlanmaydi.")) {
                setCurrentView('home');
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">
              {t.categories[currentCategory.key]?.title}
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.exam.answered}: {answeredCount} / {examQuestions.length}</span>
            </div>
          </div>
        </div>

        {/* Timer Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-extrabold shadow-inner ${
          secondsRemaining < 300
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
        }`}>
          <Clock size={18} />
          <span>{formatTime(secondsRemaining)}</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all hover:scale-105"
        >
          {t.actions.finishExam}
        </button>
      </div>

      {/* Navigator button */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-semibold text-slate-500">
          {t.practice.questionNumber} {currentIndex + 1} / {examQuestions.length}
        </span>
        <button
          type="button"
          onClick={() => setIsGridOpen(!isGridOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
        >
          <LayoutGrid size={15} />
          <span>Savollar xaritasi</span>
        </button>
      </div>

      {/* Grid Drawer */}
      {isGridOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-1">
            {examQuestions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurr = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsGridOpen(false);
                  }}
                  className={`h-8 rounded text-xs font-bold transition-all ${
                    isCurr
                      ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 scale-105'
                      : ''
                  } ${
                    isAnswered
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 block">
            {currentQ.type === 'checkbox' ? t.practice.selectMultiple : t.practice.selectOption}
          </span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            <MarkdownView content={currentQ.question} />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = currentQ.type === 'checkbox'
              ? Array.isArray(currentSelection) && currentSelection.includes(opt.id)
              : currentSelection === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {opt.key}
                </div>

                <div className="flex-1 text-sm sm:text-base leading-relaxed pt-0.5">
                  <MarkdownView content={opt.text} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setCurrentIndex(prev => prev - 1)}
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
          onClick={() => setCurrentIndex(prev => prev + 1)}
          disabled={isLast}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
            isLast
              ? 'opacity-40 cursor-not-allowed bg-slate-400'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 hover:scale-105'
          }`}
        >
          <span>{t.actions.next}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Finish Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertCircle size={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.exam.confirmFinish}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Siz {examQuestions.length} ta savoldan {answeredCount} tasiga javob berdingiz.
              {answeredCount < examQuestions.length && (
                <span className="block mt-1 font-semibold text-amber-600 dark:text-amber-400">
                  ⚠️ {examQuestions.length - answeredCount} ta savol javobsiz qolgan!
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsConfirmOpen(false);
                  handleFinish();
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-colors"
              >
                Topshirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
