import React from 'react';
import { Bot, HelpCircle } from 'lucide-react';

/**
 * TaskHeader - Top section of active task with title, badges and Verter Inspector trigger
 */
export default function TaskHeader({ 
  activeTask, 
  title, 
  topics, 
  onOpenVerter,
  onOpenGuide 
}) {
  return (
    <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500 text-white shadow-sm">
            {activeTask.exerciseGroup}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Level {activeTask.level}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ID: {activeTask.id}
          </span>
        </div>

        {/* Verter Quick Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="School 21 Verter qoidalari va yo'riqnomasi"
          >
            <HelpCircle size={14} className="text-purple-500" />
            <span className="hidden sm:inline">Verter Qo'llanmasi</span>
          </button>
          <button
            type="button"
            onClick={onOpenVerter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02]"
            title="Verter mezonlari va testlash buyruqlari"
          >
            <Bot size={14} />
            <span>Verter Tekshiruvi</span>
          </button>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
        {title}
      </h2>

      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        <span className="font-bold text-slate-700 dark:text-slate-300">Mavzu:</span>
        <span>{topics}</span>
      </div>
    </div>
  );
}
