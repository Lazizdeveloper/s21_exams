import React from 'react';

/**
 * TaskListItem - Single task navigation card in the left list
 */
export default function TaskListItem({ task, isCurrent, title, topics, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl cursor-pointer transition-all border ${
        isCurrent
          ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 shadow-sm ring-1 ring-purple-500/30'
          : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-bold font-mono tracking-tight text-purple-600 dark:text-purple-400">
          {task.id.toUpperCase()}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Level {task.level}
        </span>
      </div>
      <div className="text-xs sm:text-sm font-semibold line-clamp-1">
        {title}
      </div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
        {topics}
      </div>
    </div>
  );
}
