import React from 'react';
import { Check, Copy, FileCode } from 'lucide-react';

/**
 * TaskCodeViewer - Clean code block viewer with tab switcher (solution vs buggy original) and copy
 */
export default function TaskCodeViewer({
  activeCodeTab,
  setActiveCodeTab,
  activeTask,
  copied,
  onCopyCode,
  solutionLabel,
  originalLabel,
  copyLabel,
  copiedLabel,
}) {
  const currentCode = activeCodeTab === 'solution' 
    ? activeTask.solutionCode 
    : activeTask.originalCode;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveCodeTab('solution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeCodeTab === 'solution'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Check size={14} />
            <span>{solutionLabel}</span>
          </button>

          {activeTask.originalCode && (
            <button
              type="button"
              onClick={() => setActiveCodeTab('original')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeCodeTab === 'original'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode size={14} />
              <span>{originalLabel}</span>
            </button>
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={() => onCopyCode(currentCode)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          <span>{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>

      {/* Code Block Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-bold text-slate-300">main.c</span>
          </div>
          <span>C (C11 / School 21 Google Style)</span>
        </div>

        <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-400 leading-relaxed max-h-[460px]">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}
