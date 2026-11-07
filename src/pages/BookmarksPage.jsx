import React, { useMemo } from 'react';
import { Star, BookmarkX, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, normalizeQuestion } from '../data/categories';
import MarkdownView from '../components/MarkdownView';

export default function BookmarksPage() {
  const { lang, t, bookmarks, toggleBookmark, setCurrentView, setSelectedCategory } = useApp();

  const allQuestions = useMemo(() => {
    const list = [];
    CATEGORIES.forEach(cat => {
      cat.rawQuestions.forEach(q => {
        list.push(normalizeQuestion(q, lang, cat.id));
      });
    });
    return list;
  }, [lang]);

  const bookmarkedQuestions = useMemo(() => {
    return allQuestions.filter(q => bookmarks.includes(q.id));
  }, [allQuestions, bookmarks]);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-500" size={24} />
            <span>{t.bookmarks.title}</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Saqlangan savollar soni: {bookmarkedQuestions.length} ta
          </p>
        </div>
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <BookmarkX size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hozircha saqlangan savollar yo'q
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {t.bookmarks.empty}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('practice')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <BookOpen size={16} />
            <span>Mashq qilishga o'tish</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {q.categoryId.toUpperCase()} #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => toggleBookmark(q.id)}
                  className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                  title="Saqlanganlardan o'chirish"
                >
                  <Star size={18} className="fill-amber-500" />
                </button>
              </div>

              <div className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                <MarkdownView content={q.question} />
              </div>

              <div className="space-y-2 pt-2">
                {q.options.map(opt => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 text-sm ${
                      opt.is_correct
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      opt.is_correct ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {opt.key}
                    </span>
                    <div className="flex-1">
                      <MarkdownView content={opt.text} />
                    </div>
                  </div>
                ))}
              </div>

              {q.explanation && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold">Izoh: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
