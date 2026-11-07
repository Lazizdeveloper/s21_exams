import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Play, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

/**
 * VerterCheckerModal - Full Verter evaluation, bash snippets and interactive simulation
 */
export default function VerterCheckerModal({ isOpen, onClose, activeTask, lang }) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [simState, setSimState] = useState('idle'); // 'idle' | 'running' | 'success' | 'failed'
  const [simStep, setSimStep] = useState(0);

  if (!isOpen || !activeTask) return null;

  const sampleInput = activeTask.examples?.[0]?.input || '1 2 3';
  const sampleOutput = activeTask.examples?.[0]?.output || 'n/a';

  // Ready-to-run bash commands for local testing
  const bashSnippet = `# 1. Google Style tekshiruvi (clang-format)
clang-format -n main.c

# 2. Qat'iy bayroqlar bilan kompilyatsiya (0 warning bo'lishi shart)
gcc -Wall -Werror -Wextra -std=c11 main.c -o main.out

# 3. Masalani namunaviy kirish bilan ishga tushirish
printf "${sampleInput}\\n" | ./main.out

# 4. Xotirani tekshirish (Linux: valgrind, Mac: leaks)
valgrind --tool=memcheck --leak-check=yes ./main.out
# yoki Mac da: leaks -atExit -- ./main.out | grep LEAK:`;

  const handleCopyBash = () => {
    navigator.clipboard.writeText(bashSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleRunSimulation = () => {
    setSimState('running');
    setSimStep(1);

    setTimeout(() => {
      setSimStep(2);
      setTimeout(() => {
        setSimStep(3);
        setTimeout(() => {
          setSimStep(4);
          setSimState('success');
        }, 600);
      }, 600);
    }, 600);
  };

  const handleResetSimulation = () => {
    setSimState('idle');
    setSimStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  MiniVERTER Tekshiruv Rejimi
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  School 21 v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masala ID: <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{activeTask.id}</span> • Masalaning Verter talablari
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key 4 Evaluation Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 size={16} className="text-purple-500" />
                <span>1. Style Test (Google)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <code className="text-purple-600 dark:text-purple-400 font-mono">clang-format -n</code> orqali tekshiriladi. 2 probelli indentatsiya, qavslar va satr uzunligi.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>2. Qat'iy Kompilyatsiya</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">-Wall -Werror -Wextra -std=c11</code>. Bitta ham ogohlantirish (warning) o'tmaydi.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <ShieldCheck size={16} className="text-blue-500" />
                <span>3. Xotira Sizib Chiqishi</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <code className="text-blue-600 dark:text-blue-400 font-mono">valgrind</code> yoki <code className="text-blue-600 dark:text-blue-400 font-mono">leaks</code> tekshiradi. Har bir <code className="font-mono">malloc</code> uchun <code className="font-mono">free</code> shart.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>4. Chiqish va "n/a"</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Noto'g'ri kirishda faqat <code className="text-amber-600 dark:text-amber-400 font-mono">n/a</code> chiqishi va oxirida ortiqcha <code className="font-mono">\n</code> bo'lmasligi kerak.
              </p>
            </div>
          </div>

          {/* Interactive Verter Simulator */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-purple-400" />
                <span className="font-bold text-slate-300">MiniVERTER Simulator</span>
              </div>
              <div className="flex items-center gap-2">
                {simState !== 'idle' && (
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    <RotateCcw size={12} />
                    <span>Qayta</span>
                  </button>
                )}
                {simState === 'idle' && (
                  <button
                    type="button"
                    onClick={handleRunSimulation}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                  >
                    <Play size={12} />
                    <span>Sinab ko'rish</span>
                  </button>
                )}
              </div>
            </div>

            {/* Terminal Screen */}
            <div className="font-mono text-xs space-y-1.5 py-1 text-slate-300">
              <div className="text-purple-400 font-bold">
                MiniVERTER is watching your code... ¯\_(*_*)_/¯
              </div>

              {simState === 'idle' && (
                <div className="text-slate-500 text-[11px] italic py-2">
                  "Sinab ko'rish" tugmasini bosing — Verter yechim kodini tekshirish jarayonini ko'rsatadi.
                </div>
              )}

              {simStep >= 1 && (
                <div className="flex items-center justify-between text-slate-200">
                  <span>[1/4] Style test (clang-format -n):</span>
                  <span className="text-emerald-400 font-bold">OK (1)</span>
                </div>
              )}

              {simStep >= 2 && (
                <div className="flex items-center justify-between text-slate-200">
                  <span>[2/4] Build test (gcc -Wall -Werror -Wextra):</span>
                  <span className="text-emerald-400 font-bold">OK (1)</span>
                </div>
              )}

              {simStep >= 3 && (
                <div className="flex items-center justify-between text-slate-200">
                  <span>[3/4] Memory check (valgrind / leaks):</span>
                  <span className="text-emerald-400 font-bold">0 leaks / 0 errors</span>
                </div>
              )}

              {simStep >= 4 && (
                <div className="flex items-center justify-between text-slate-200">
                  <span>[4/4] Test cases stdout verification:</span>
                  <span className="text-emerald-400 font-bold">5/5 PASSED</span>
                </div>
              )}

              {simState === 'success' && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                  🎉 VERTER RESULT: SUCCESS (100% Passed)
                </div>
              )}
            </div>
          </div>

          {/* Copyable Bash Commands for Local Machine */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                O'z kompyuteringizda (Terminal) tekshirish buyruqlari
              </h4>
              <button
                type="button"
                onClick={handleCopyBash}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {copiedSnippet ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copiedSnippet ? "Nusxalandi!" : "Nusxalash"}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
              <code>{bashSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            Tushundim, yopish
          </button>
        </div>
      </div>
    </div>
  );
}
