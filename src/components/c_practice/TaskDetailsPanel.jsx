import React, { useState } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  Lightbulb, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  HelpCircle,
  Bot
} from 'lucide-react';
import MarkdownView from '../MarkdownView';
import TaskExamplesTable from './TaskExamplesTable';

/**
 * TaskDetailsPanel - Task instructions, examples, hints, and expandable solution accordion
 */
export default function TaskDetailsPanel({
  activeTask,
  title,
  topics,
  desc,
  onOpenVerter,
  onOpenGuide,
  onLoadSolutionToEditor,
}) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  const handleCopySolution = () => {
    if (!activeTask?.solutionCode) return;
    navigator.clipboard.writeText(activeTask.solutionCode);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-5">
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
            <span className="text-xs text-slate-400 font-mono">
              ID: {activeTask.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenGuide}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              title="School 21 Verter Qo'llanmasi"
            >
              <HelpCircle size={16} />
            </button>
            <button
              type="button"
              onClick={onOpenVerter}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors"
            >
              <Bot size={13} />
              <span>Verter Qoidalari</span>
            </button>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300">Mavzu: </span>
          {topics}
        </p>
      </div>

      {/* Task Description */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Terminal size={14} className="text-purple-500" />
          <span>Topshiriq sharti</span>
        </h3>
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <MarkdownView content={desc} />
        </div>
      </div>

      {/* Examples Stdin / Stdout */}
      <TaskExamplesTable 
        examples={activeTask.examples} 
        label="Namunaviy kirish va chiqish (Test keyslar)" 
      />

      {/* School 21 Notes Alert */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle size={14} />
          <span>Verter eslatmasi:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 dark:text-amber-300/90 pl-1 text-[11px]">
          <li>Noto'g'ri kiritishda faqat <code className="font-mono font-bold bg-amber-100 dark:bg-amber-900/60 px-1 rounded">"n/a"</code> chiqishi shart.</li>
          <li>Kompilyatsiya: <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">-Wall -Werror -Wextra -std=c11</code>.</li>
        </ul>
      </div>

      {/* Hints & Solution Accordions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        {/* Hint Accordion */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={14} className="text-amber-500" />
              <span>💡 Qadam-baqadam maslahat (Hint)</span>
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              {showHints ? "Yashirish" : "Ochish"}
            </span>
          </button>
          {showHints && (
            <div className="p-3.5 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <p>1. <strong>Kirish ma'lumotlarini tekshiring</strong>: <code className="font-mono text-purple-600">if (scanf(...) != 1)</code> orqali harf kiritilgan holatlarni darhol ushlang.</p>
              <p>2. <strong>Chegara holatlariga e'tibor bering</strong>: Manfiy sonlar, nol yoki haddan tashqari katta sonlar kiritilganda dastur qanday ishlashi kerakligini o'ylab ko'ring.</p>
              <p>3. <strong>Kod uslubi</strong>: Kod yozib bo'lgach, <strong>Clang-Format</strong> tugmasini bosing, aks holda Verter birinchi tekshiruvdayoq 0 qo'yadi.</p>
            </div>
          )}
        </div>

        {/* Hidden Solution Accordion (Cheat) */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowSolution(!showSolution)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              {showSolution ? <EyeOff size={14} /> : <Eye size={14} className="text-purple-500" />}
              <span>Tayyor yechim kodi (Faqat tiqilib qolganda oching)</span>
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              {showSolution ? "Yashirish" : "Ko'rsatish"}
            </span>
          </button>

          {showSolution && (
            <div className="p-3.5 bg-slate-950 text-xs text-slate-300 space-y-3 border-t border-slate-800 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Tekshirilgan to'g'ri yechim:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onLoadSolutionToEditor}
                    className="px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-[11px] transition-colors"
                  >
                    Muharrirga ko'chirish
                  </button>
                  <button
                    type="button"
                    onClick={handleCopySolution}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors"
                  >
                    {copiedSolution ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedSolution ? "Nusxalandi" : "Nusxalash"}</span>
                  </button>
                </div>
              </div>
              <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 overflow-x-auto max-h-48 text-[11px]">
                <code>{activeTask.solutionCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
