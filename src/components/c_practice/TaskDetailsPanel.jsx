import React, { useState } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  Lightbulb, 
  HelpCircle,
  Bot
} from 'lucide-react';
import MarkdownView from '../MarkdownView';
import TaskExamplesTable from './TaskExamplesTable';

/**
 * TaskDetailsPanel - Task instructions, test examples, hints, and Verter guide
 * NOTE: Tayyor yechim faqat imtihon yakunlanganda (oxirida) ko'rsatiladi.
 */
export default function TaskDetailsPanel({
  activeTask,
  title,
  topics,
  desc,
  onOpenVerter,
  onOpenGuide,
}) {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4 h-full overflow-y-auto scrollbar-thin">
      {/* Task Header */}
      <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500 text-white shadow-sm">
              {activeTask.exerciseGroup}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Level {activeTask.level}
            </span>
            <span className="text-xs font-mono text-slate-400">
              ID: {activeTask.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenGuide}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="C dasturlash va imtihon qo'llanmasi"
            >
              <HelpCircle size={16} />
            </button>
            <button
              type="button"
              onClick={onOpenVerter}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
              title="MiniVERTER tekshiruv qoidalari"
            >
              <Bot size={14} />
              <span>Verter Qoidalari</span>
            </button>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>

        {topics && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Mavzu:</span> {topics}
          </p>
        )}
      </div>

      {/* Task Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Terminal size={14} className="text-purple-500" />
          <span>Topshiriq sharti</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
          <MarkdownView content={desc} />
        </div>
      </div>

      {/* Test Examples (Input / Output) */}
      <TaskExamplesTable examples={activeTask.examples} />

      {/* Verter School 21 Hard Requirements Alert */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle size={15} className="shrink-0 text-amber-500" />
          <span>Verter eslatmasi:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] opacity-90">
          <li>Noto'g'ri kiritishda faqat <code className="font-mono bg-amber-500/20 px-1 py-0.2 rounded font-bold">"n/a"</code> chiqishi shart.</li>
          <li>Kompilyatsiya: <code className="font-mono bg-amber-500/20 px-1 py-0.2 rounded">-Wall -Werror -Wextra -std=c11</code>.</li>
        </ul>
      </div>

      {/* Hints Accordion */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={14} className="text-amber-500" />
              <span>💡 Maslahat (Hint)</span>
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              {showHints ? "Yashirish" : "Ochish"}
            </span>
          </button>
          {showHints && (
            <div className="p-3.5 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <p>1. <strong>Kirish ma'lumotlarini tekshiring</strong>: <code className="font-mono text-purple-600">if (scanf(...) != 1)</code> orqali harf kiritilgan holatlarni darhol ushlang.</p>
              <p>2. <strong>Chegara holatlariga e'tibor bering</strong>: Manfiy sonlar, nol yoki noto'g'ri qiymatlar kiritilganda <code className="font-mono text-purple-600">printf("n/a")</code> chiqishini ta'minlang.</p>
              <p>3. <strong>Kod uslubi</strong>: Kodni terminalda <code className="font-mono text-purple-600">clang-format -i main.c</code> orqali formatlang.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
