import React, { useState, useMemo } from 'react';
import { Search, Star, Eye, EyeOff, Filter, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, normalizeQuestion } from '../data/categories';
import MarkdownView from '../components/MarkdownView';

export default function BrowseCatalogPage() {
  const { lang, t, selectedCategory, toggleBookmark, isBookmarked } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState(() => {
    return selectedCategory ? selectedCategory.id : 'all';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Flatten all questions
  const allQuestions = useMemo(() => {
    const list = [];
    CATEGORIES.forEach(cat => {
      cat.rawQuestions.forEach(q => {
        list.push(normalizeQuestion(q, lang, cat.id));
      });
    });
    return list;
  }, [lang]);

  // Filtered questions
  const filteredList = useMemo(() => {
    return allQuestions.filter(q => {
      const matchesCat = activeCategoryFilter === 'all' || q.categoryId === activeCategoryFilter;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;

      const qText = (q.question || '').toLowerCase();
      const expText = (q.explanation || '').toLowerCase();
      const optsText = q.options.map(o => o.text).join(' ').toLowerCase();
      const query = searchQuery.toLowerCase();

      return qText.includes(query) || expText.includes(query) || optsText.includes(query);
    });
  }, [allQuestions, activeCategoryFilter, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {t.catalog.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Jami {allQuestions.length} ta savol bo'yicha tezkor qidiruv va tahlil
        </p>
      </div>

      {/* Search Input & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-sm transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategoryFilter === 'all'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Barchasi ({allQuestions.length})
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategoryFilter === cat.id
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.categories[cat.key]?.title || cat.id} ({cat.totalQuestions})
            </button>
          ))}
        </div>
      </div>

      {/* Results Stats */}
      <div className="text-xs font-bold text-slate-500">
        {t.catalog.totalFound}: <span className="text-slate-900 dark:text-white">{filteredList.length}</span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredList.map((q, idx) => {
          const isExpanded = !!expandedQuestions[q.id];
          const bookmarked = isBookmarked(q.id);

          return (
            <div
              key={q.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {q.categoryId.toUpperCase()} #{idx + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">ID: {q.rawId}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      bookmarked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                    }`}
                  >
                    <Star size={16} className={bookmarked ? 'fill-amber-500' : ''} />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(q.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{isExpanded ? t.catalog.hideAnswer : t.catalog.showAnswer}</span>
                  </button>
                </div>
              </div>

              <div className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                <MarkdownView content={q.question} />
              </div>

              {/* Collapsible Answers */}
              {isExpanded && (
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 animate-fadeIn">
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 text-sm ${
                          opt.is_correct
                            ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium'
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
                        {opt.is_correct && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={15} />
                            To'g'ri
                          </span>
                        )}
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
