import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  CheckCircle2, 
  Copy, 
  Check, 
  Shuffle, 
  Code2, 
  UserCheck, 
  FileText 
} from 'lucide-react';

/**
 * ExamResultsModal - Imtihon yakunidagi rasmiy natijalar va barcha 5 ta savolning TAYYOR YECHIMLARI
 */
export default function ExamResultsModal({
  isOpen,
  onClose,
  examTasks,
  completedTaskIds = [],
  onStartNewExam,
  lang = 'uz'
}) {
  const [activeTabTaskIndex, setActiveTabTaskIndex] = useState(0);
  const [viewMode, setViewMode] = useState('solution'); // 'solution' | 'myCode'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !examTasks || examTasks.length === 0) return null;

  const currentTask = examTasks[activeTabTaskIndex] || examTasks[0];
  const isPassed = completedTaskIds.includes(currentTask?.id);

  // Talabaning LocalStorage dagi kodi
  const studentCode = currentTask ? localStorage.getItem(`s21_code_${currentTask.id}`) || '' : '';
  const solutionCode = currentTask?.solutionCode || '// Yechim mavjud emas';

  const displayedCode = viewMode === 'solution' ? solutionCode : (studentCode || currentTask?.originalCode || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = examTasks.filter(t => completedTaskIds.includes(t.id)).length;
  const percentage = Math.round((completedCount / examTasks.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30">
              <Trophy size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Imtihon Natijalari va Tayyor Yechimlar
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  percentage >= 80 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }`}>
                  {completedCount} / 5 topshirildi ({percentage}%)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                School 21 standarti bo'yicha tayyor to'g'ri yechimlar va taqqoslash
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task Selection Tabs (1-5) */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Savollar:
          </span>
          {examTasks.map((task, idx) => {
            const isSelected = idx === activeTabTaskIndex;
            const taskPassed = completedTaskIds.includes(task.id);
            const qNum = task.questionNumber || idx + 1;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setActiveTabTaskIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Savol {qNum} (Lvl {task.level})</span>
                {taskPassed ? (
                  <CheckCircle2 size={13} className={isSelected ? 'text-white' : 'text-emerald-500'} />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white/40' : 'bg-slate-500'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body: Selected Task Solution & Comparison */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Current Question Title & Info */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {currentTask.id.toUpperCase()}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Level {currentTask.level}
                </span>
                {isPassed && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Verter: 100% Passed</span>
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentTask.title?.[lang] || currentTask.title?.uz || currentTask.title}
              </h4>
            </div>

            {/* Switcher: Solution vs Student Code */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('solution')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'solution'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 size={13} />
                <span>Tayyor to'g'ri yechim</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('myCode')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'myCode'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck size={13} />
                <span>Mening kodim</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Block */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className={`w-2.5 h-2.5 rounded-full ${viewMode === 'solution' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <span className="font-bold text-slate-200">
                  {viewMode === 'solution' ? 'solution_main.c (To\'g\'ri yechim)' : 'student_main.c (Mening kodim)'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                title="Kodni nusxalash"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? "Nusxalandi" : "Nusxa olish"}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-emerald-300 dark:text-emerald-400 overflow-x-auto leading-relaxed max-h-96">
              <code>{displayedCode}</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Yopish
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onStartNewExam) onStartNewExam();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all"
          >
            <Shuffle size={14} />
            <span>Yangi 5 ta savolni boshlash (Aralashtirish)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
