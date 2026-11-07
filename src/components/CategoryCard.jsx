import React from 'react';
import { Terminal, Globe, Database, Cpu, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONS = {
  Terminal,
  Globe,
  Database,
  Cpu,
};

export default function CategoryCard({ category, onSelectPractice, onSelectExam, onSelectCatalog }) {
  const { t } = useApp();
  const IconComponent = ICONS[category.icon] || Terminal;
  const catTrans = t.categories[category.key] || {};

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header: Icon & Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${category.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent size={24} className="stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {catTrans.badge || `${category.totalQuestions} questions`}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {catTrans.title || category.key}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {catTrans.desc || ''}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectPractice(category)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <BookOpen size={15} />
            <span>{t.actions.startPractice}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectExam(category)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <CheckCircle size={15} />
            <span>{t.actions.startExam}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSelectCatalog(category)}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <span>{t.actions.viewAll}</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
