import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Copy, 
  Check, 
  Shuffle, 
  Code2, 
  UserCheck, 
  AlertTriangle,
  Bot
} from 'lucide-react';
import { evaluateWithVerter } from '../../utils/cRunnerService';

const PASSING_THRESHOLD = 4; // 5 tadan kamida 4 ta masala to'g'ri bo'lishi shart

/**
 * AutoVerterExamModal - "Imtihonni yakunlash" bosilganda MiniVERTER avtomatik 5 ta savolni tekshiradi
 * Natija: >= 4 ta to'g'ri bo'lsa imtihondan o'tadi, aks holda yiqiladi.
 * Oxirida har bir savolning to'liq tayyor yechimi ko'rsatiladi.
 */
export default function AutoVerterExamModal({
  isOpen,
  onClose,
  examTasks,
  onStartNewExam,
  lang = 'uz'
}) {
  const [evalState, setEvalState] = useState('evaluating'); // 'evaluating' | 'completed'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taskResults, setTaskResults] = useState({}); // taskId -> { passed, score, logs }
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [codeViewTab, setCodeViewTab] = useState('solution'); // 'solution' | 'myCode'
  const [copied, setCopied] = useState(false);
  const hasTriggeredConfetti = useRef(false);

  // Modal ochilishi bilan avtomatik ketma-ket 5 ta savolni tekshirish
  useEffect(() => {
    if (!isOpen || !examTasks || examTasks.length === 0) return;

    let isCancelled = false;
    setEvalState('evaluating');
    setCurrentIndex(0);
    setTaskResults({});
    hasTriggeredConfetti.current = false;

    const runAllEvaluations = async () => {
      const resultsAccumulator = {};

      for (let i = 0; i < examTasks.length; i++) {
        if (isCancelled) return;
        setCurrentIndex(i);

        const task = examTasks[i];
        const studentCode = localStorage.getItem(`s21_code_${task.id}`) || task.originalCode || '';

        try {
          const evalRes = await evaluateWithVerter(studentCode, task);
          resultsAccumulator[task.id] = {
            passed: evalRes.success,
            score: evalRes.score || (evalRes.success ? 100 : 0),
            stage: evalRes.stage,
            logs: evalRes.logs || [],
            studentCode,
          };
        } catch (err) {
          resultsAccumulator[task.id] = {
            passed: false,
            score: 0,
            stage: 'error',
            logs: [`Tekshiruv xatosi: ${err.message}`],
            studentCode,
          };
        }

        if (isCancelled) return;
        setTaskResults({ ...resultsAccumulator });
      }

      if (isCancelled) return;
      setEvalState('completed');

      // Hisoblash: 5 tadan nechta to'g'ri?
      const passedCount = Object.values(resultsAccumulator).filter(r => r.passed).length;
      if (passedCount >= PASSING_THRESHOLD && !hasTriggeredConfetti.current) {
        hasTriggeredConfetti.current = true;
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    };

    runAllEvaluations();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, examTasks]);

  if (!isOpen || !examTasks || examTasks.length === 0) return null;

  const passedCount = Object.values(taskResults).filter(r => r.passed).length;
  const isExamPassed = passedCount >= PASSING_THRESHOLD;
  const isFinished = evalState === 'completed';

  const currentTask = examTasks[selectedTaskIndex] || examTasks[0];
  const currentResult = taskResults[currentTask?.id];
  const solutionCode = currentTask?.solutionCode || '// Yechim mavjud emas';
  const studentCode = currentResult?.studentCode || localStorage.getItem(`s21_code_${currentTask?.id}`) || currentTask?.originalCode || '';

  const activeCode = codeViewTab === 'solution' ? solutionCode : studentCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <Bot size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>MiniVERTER Imtihon Tekshiruvi</span>
                {isFinished && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                    isExamPassed 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {isExamPassed ? "IMTIHONDAN O'TDI" : "YIQILDI"}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                School 21 qat'iy tekshiruvi: 5 tadan kamida 4 ta masala to'g'ri bo'lishi shart
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

        {/* Evaluation Banner Status */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 shrink-0">
          {!isFinished ? (
            <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
              <Loader2 size={24} className="animate-spin text-purple-500" />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Savol {currentIndex + 1} / 5 MiniVERTER tomonidan tekshirilmoqda...
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Google Style (clang-format), Cppcheck, GCC (-Wall -Werror) va avtotestlar sinovi
                </div>
              </div>
            </div>
          ) : isExamPassed ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Trophy size={22} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black">
                    TABRIKLAYMIZ! SIZ IMTIHONDAN O'TDINGIZ! 🎉
                  </h4>
                  <p className="text-xs opacity-90">
                    Siz 5 ta masaladan <strong>{passedCount} tasini</strong> to'liq to'g'ri bajardingiz (Talab: kamida 4 ta).
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-emerald-500">{passedCount}/5</span>
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Muvaffaqiyatli</div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <XCircle size={22} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black">
                    AFSUSKI, IMTIHONDAN YIQILDINGIZ ❌
                  </h4>
                  <p className="text-xs opacity-90">
                    Siz 5 tadan <strong>{passedCount} ta</strong> to'g'ri bajardingiz. Imtihondan o'tish uchun kamida 4 ta masala to'g'ri bo'lishi shart.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-rose-500">{passedCount}/5</span>
                <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">Yiqildi</div>
              </div>
            </div>
          )}
        </div>

        {/* 5 Questions Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Savollar:
          </span>
          {examTasks.map((task, idx) => {
            const isSelected = idx === selectedTaskIndex;
            const res = taskResults[task.id];
            const isEvaluatingThis = !isFinished && idx === currentIndex;
            const qNum = task.questionNumber || idx + 1;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Savol {qNum} (Lvl {task.level})</span>
                {isEvaluatingThis ? (
                  <Loader2 size={13} className="animate-spin text-purple-400" />
                ) : res ? (
                  res.passed ? (
                    <CheckCircle2 size={14} className={isSelected ? 'text-white' : 'text-emerald-500'} />
                  ) : (
                    <XCircle size={14} className={isSelected ? 'text-white' : 'text-rose-500'} />
                  )
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body: Task details, Verter logs, and Ready Solution Code */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Active Question Info */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {currentTask.id.toUpperCase()}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Level {currentTask.level}
                </span>
                {currentResult && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                    currentResult.passed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  }`}>
                    {currentResult.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>{currentResult.passed ? 'Verter: 100% Passed' : 'Verter: Failed (0%)'}</span>
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentTask.title?.[lang] || currentTask.title?.uz || currentTask.title}
              </h4>
            </div>

            {/* Switcher: Ready Solution vs Student Code */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCodeViewTab('solution')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  codeViewTab === 'solution'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 size={13} />
                <span>Tayyor to'g'ri yechim</span>
              </button>
              <button
                type="button"
                onClick={() => setCodeViewTab('myCode')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  codeViewTab === 'myCode'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck size={13} />
                <span>Mening kodim</span>
              </button>
            </div>
          </div>

          {/* Verter Test Logs (if any) */}
          {currentResult?.logs && currentResult.logs.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 p-3 text-[11px] font-mono text-slate-300 space-y-0.5 max-h-36 overflow-y-auto scrollbar-thin">
              <div className="text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                <Bot size={13} className="text-purple-400" />
                <span>MiniVERTER xulosasi:</span>
              </div>
              {currentResult.logs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={
                    log.includes('PASSED') || log.includes('SUCCESS') || log.includes('OK')
                      ? 'text-emerald-400' 
                      : log.includes('FAIL') || log.includes('xatosi')
                        ? 'text-rose-400 font-bold'
                        : 'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Code Viewer Block (C syntax) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className={`w-2.5 h-2.5 rounded-full ${codeViewTab === 'solution' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <span className="font-bold text-slate-200">
                  {codeViewTab === 'solution' ? 'solution_main.c (Tayyor to\'g\'ri yechim)' : 'student_main.c (Mening kodim)'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                title="Kodni nusxalash"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? "Nusxalandi" : "Nusxa olish"}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-emerald-300 dark:text-emerald-400 overflow-x-auto leading-relaxed max-h-80">
              <code>{activeCode}</code>
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
            <span>Yangi 5 ta imtihon savolini boshlash (Aralashtirish)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
