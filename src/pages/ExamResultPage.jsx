import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  ArrowLeft, 
  HelpCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import MarkdownView from '../components/MarkdownView';

export default function ExamResultPage() {
  const { t, activeExamResult, setCurrentView, setSelectedCategory } = useApp();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'mistakes'

  const res = activeExamResult;

  useEffect(() => {
    if (res && res.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [res]);

  if (!res) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-500">Natijalar topilmadi.</p>
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold"
        >
          {t.actions.backHome}
        </button>
      </div>
    );
  }

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} daqiqa ${s} soniya`;
  };

  const filteredQuestions = filterMode === 'mistakes'
    ? res.reviewData.filter(item => !item.isCorrect)
    : res.reviewData;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Top Banner Card */}
      <div className={`rounded-3xl p-8 border shadow-xl text-center space-y-6 ${
        res.passed
          ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border-emerald-500/30'
          : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-amber-500/10 border-rose-500/30'
      }`}>
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${
          res.passed
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30'
            : 'bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-rose-500/30'
        }`}>
          {res.passed ? <Trophy size={40} /> : <XCircle size={40} />}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {res.categoryTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {res.passed ? t.exam.passed : t.exam.failed}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.exam.passingScore || "O'tish chegarasi"}: <span className="font-bold text-slate-900 dark:text-white">{res.passingScorePercent || (res.categoryKey === 'devops' ? 80 : 50)}%</span> • {t.exam.yourScore || "Sizning natijangiz"}: <span className="font-bold text-slate-900 dark:text-white">{res.percentage}%</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{res.percentage}%</div>
            <div className="text-xs font-medium text-slate-500">{t.exam.accuracy}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">{res.correctCount}</div>
            <div className="text-xs font-medium text-slate-500">{t.exam.correctCount}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-500">{res.incorrectCount}</div>
            <div className="text-xs font-medium text-slate-500">{t.exam.incorrectCount}</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white pt-1.5">{formatSeconds(res.timeSpentSeconds)}</div>
            <div className="text-xs font-medium text-slate-500">{t.exam.timeSpent}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('exam')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <RotateCcw size={16} />
            <span>{t.actions.retake}</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('practice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <BookOpen size={16} />
            <span>{t.actions.startPractice}</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t.actions.backHome}</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.exam.reviewAnswers}
          </h3>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Barchasi ({res.reviewData.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('mistakes')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'mistakes'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Faqat xatolar ({res.incorrectCount})
            </button>
          </div>
        </div>

        {/* Questions Breakdown List */}
        <div className="space-y-4">
          {filteredQuestions.map((item, idx) => {
            const q = item.question;
            const isCorr = item.isCorrect;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 space-y-4 shadow-sm ${
                  isCorr
                    ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white ${
                      isCorr ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isCorr ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isCorr ? 'To‘g‘ri' : 'Xato javob berildi'}
                    </span>
                  </div>
                </div>

                <div className="text-base font-bold text-slate-900 dark:text-white">
                  <MarkdownView content={q.question} />
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {q.options.map(opt => {
                    const isUserChoice = Array.isArray(item.userSelection)
                      ? item.userSelection.includes(opt.id)
                      : item.userSelection === opt.id;

                    let rowStyle = 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                    let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

                    if (opt.is_correct) {
                      rowStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                      badgeStyle = 'bg-emerald-500 text-white font-bold';
                    } else if (isUserChoice && !opt.is_correct) {
                      rowStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                      badgeStyle = 'bg-rose-500 text-white font-bold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 text-sm leading-relaxed ${rowStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${badgeStyle}`}>
                          {opt.key}
                        </span>
                        <div className="flex-1">
                          <MarkdownView content={opt.text} />
                        </div>
                        {opt.is_correct && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={15} />
                            To'g'ri
                          </span>
                        )}
                        {isUserChoice && !opt.is_correct && (
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle size={15} />
                            Sizning javobingiz
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <HelpCircle size={14} className="text-emerald-500" />
                      <span>{t.practice.explanation}</span>
                    </div>
                    <p className="pl-5 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
