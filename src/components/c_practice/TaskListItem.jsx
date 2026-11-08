import React from 'react';
import { Award, ChevronRight } from 'lucide-react';

/**
 * TaskListItem - Imtihon savoli kartochkasi (5 ta savol uchun moslashtirilgan)
 */
export default function TaskListItem({ task, isCurrent, title, topics, onSelect }) {
  const questionNumber = task.questionNumber || 1;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all border flex items-center justify-between gap-2 group ${
        isCurrent
          ? 'border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200 shadow-xs ring-1 ring-purple-500/30'
          : 'border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Question Index Badge */}
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
            isCurrent
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400'
          }`}
        >
          {questionNumber}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 leading-none mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
              Savol {questionNumber}
            </span>
            <span className="text-slate-300 dark:text-slate-600 text-[9px]">•</span>
            <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
              Level {task.level}
            </span>
          </div>
          <div className="text-xs font-medium truncate leading-tight">
            {title}
          </div>
        </div>
      </div>

      <ChevronRight
        size={13}
        className={`shrink-0 transition-transform ${
          isCurrent
            ? 'text-purple-500 translate-x-0.5'
            : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'
        }`}
      />
    </button>
  );
}
