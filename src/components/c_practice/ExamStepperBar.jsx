import React from 'react';
import { ArrowLeft, Shuffle, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * ExamStepperBar - Imtihon yuqori navigatsiya paneli
 * 5 ta qiyinlashib boruvchi savol bosqichlari (Level 1 -> Level 5) va yangi variant tugmasi
 */
export default function ExamStepperBar({
  tasks,
  activeTaskId,
  onSelectTask,
  onShuffle,
  onBackHome,
  lang = 'uz'
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBackHome}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Bosh sahifaga qaytish"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-slate-800 dark:text-white">
            C Praktika
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Imtihon rejimi (5 ta masala)
          </span>
        </div>
      </div>

      {/* Center: 5 Progressive Question Stepper Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
        {tasks.map((task, idx) => {
          const isCurrent = task.id === activeTaskId;
          const qNum = task.questionNumber || idx + 1;

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelectTask(task.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                isCurrent ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
              }`}>
                {qNum}
              </span>
              <span>Savol {qNum}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded ${
                isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                Lvl {task.level}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Shuffle / New 5 Questions Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShuffle}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors shadow-xs"
          title="Yangi 5 ta tasodifiy imtihon masalalarini tanlash"
        >
          <Shuffle size={13} className="text-purple-600 dark:text-purple-400" />
          <span className="hidden sm:inline">Yangi 5 ta savol (Aralashtirish)</span>
          <span className="sm:hidden">Yangi savollar</span>
        </button>
      </div>
    </div>
  );
}
