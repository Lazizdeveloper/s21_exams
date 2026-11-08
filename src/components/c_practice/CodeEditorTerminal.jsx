import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Sparkles, 
  ShieldAlert, 
  Bot, 
  Terminal as TerminalIcon, 
  RotateCcw, 
  FileCode, 
  Check, 
  Trash2,
  Loader2
} from 'lucide-react';
import { formatCCode } from '../../utils/clangFormatService';
import { runCppcheck } from '../../utils/cppcheckService';
import { executeCCode, evaluateWithVerter } from '../../utils/cRunnerService';

/**
 * CodeEditorTerminal - In-browser VS Code (Monaco) Editor with Clang-Format, Cppcheck, GCC Runner and Verter Terminal
 */
export default function CodeEditorTerminal({
  code,
  onChangeCode,
  activeTask,
  onResetOriginal,
  onLoadSolution,
}) {
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'verter' | 'cppcheck'
  const [stdinValue, setStdinValue] = useState(activeTask?.examples?.[0]?.input || '');
  const [terminalLogs, setTerminalLogs] = useState([
    'School 21 C Interactive Environment v1.0',
    'GCC 11, Clang-Format (Google Style), Cppcheck & MiniVERTER faol.',
    'Kodni yozing va "Ishga tushirish" yoki "Verter Tekshiruvi" tugmasini bosing.',
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  // Handle Clang-Format (Google Style)
  const handleFormat = async () => {
    setIsFormatting(true);
    try {
      const formatted = await formatCCode(code);
      onChangeCode(formatted);
      setTerminalLogs(prev => [
        ...prev,
        '$ clang-format -i main.c',
        '✅ Kod School 21 Google C++ Style standartiga muvofiq formatlandi (2 probel, to\'g\'ri qavslar).'
      ]);
    } catch (err) {
      setTerminalLogs(prev => [...prev, `Format xatosi: ${err.message}`]);
    } finally {
      setIsFormatting(false);
    }
  };

  // Handle Cppcheck static analysis
  const handleCppcheck = () => {
    setActiveTab('cppcheck');
    const res = runCppcheck(code);
    setTerminalLogs(prev => [
      ...prev,
      '$ cppcheck --enable=all main.c',
      ...res.logs,
    ]);
  };

  // Handle GCC Run
  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('terminal');
    setTerminalLogs(prev => [
      ...prev,
      `$ gcc -Wall -Werror -Wextra -std=c11 main.c -o a.out`,
      `$ ./a.out < stdin ("${stdinValue}")`,
      '⏳ Bajarilmoqda...',
    ]);

    const res = await executeCCode(code, stdinValue);
    setIsRunning(false);

    if (res.compileOutput && !res.success) {
      setTerminalLogs(prev => [
        ...prev,
        '❌ Kompilyatsiya xatosi (Build Error):',
        res.compileOutput,
      ]);
    } else if (res.stderr && !res.success) {
      setTerminalLogs(prev => [
        ...prev,
        '❌ Xatolik yuz berdi:',
        res.stderr,
      ]);
    } else {
      setTerminalLogs(prev => [
        ...prev,
        `Chiqish (stdout):`,
        res.stdout || "(bo'sh chiqish)",
        `[Jarayon muvaffaqiyatli yakunlandi. Vaqt: ${res.time}s, Xotira: ${res.memory}KB]`,
      ]);
    }
  };

  // Handle Verter evaluation
  const handleVerterTest = async () => {
    setIsRunning(true);
    setActiveTab('verter');
    setTerminalLogs(prev => [
      ...prev,
      '-------------------------------------------------------------------------------',
      '🤖 MiniVERTER ishga tushirilmoqda...',
    ]);

    const res = await evaluateWithVerter(code, activeTask);
    setIsRunning(false);
    setTerminalLogs(prev => [...prev, ...res.logs]);
  };

  const handleClearTerminal = () => {
    setTerminalLogs(['Terminal tozalandi.']);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
      {/* Top VS Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>main.c</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            C (C11 / School 21)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {activeTask?.originalCode && (
            <button
              type="button"
              onClick={onResetOriginal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-[11px]"
              title="Topshiriqdagi xatoli boshlang'ich kodni qaytarish"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Xatoli kodni yuklash</span>
            </button>
          )}

          {activeTask?.solutionCode && (
            <button
              type="button"
              onClick={onLoadSolution}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors font-medium text-[11px]"
              title="Yechim kodini yuklash"
            >
              <FileCode size={12} />
              <span className="hidden sm:inline">Yechimni ko'rish</span>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="h-[360px] sm:h-[420px] w-full bg-slate-950 relative">
        <Editor
          height="100%"
          defaultLanguage="c"
          language="c"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          options={{
            fontSize: 13,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            formatOnType: false,
            formatOnPaste: false,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Run Button */}
          <button
            type="button"
            disabled={isRunning}
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02]"
          >
            {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
            <span>Ishga tushirish (Run)</span>
          </button>

          {/* Clang-Format Button */}
          <button
            type="button"
            disabled={isFormatting}
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            title="Google Style bo'yicha avtomatik formatlash"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>Clang-Format</span>
          </button>

          {/* Cppcheck Button */}
          <button
            type="button"
            onClick={handleCppcheck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            title="Statik kod tahlili (Memory leak, xatolar)"
          >
            <ShieldAlert size={13} className="text-blue-500" />
            <span>Cppcheck</span>
          </button>
        </div>

        {/* Verter Test Button */}
        <button
          type="button"
          disabled={isRunning}
          onClick={handleVerterTest}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-purple-500/25 transition-all hover:scale-[1.02]"
        >
          <Bot size={14} />
          <span>🤖 Verter Tekshiruvi</span>
        </button>
      </div>

      {/* Terminal & Output Section */}
      <div className="bg-slate-950 flex flex-col font-mono text-xs">
        {/* Terminal Tab Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'terminal' ? 'bg-slate-800 text-emerald-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <TerminalIcon size={12} />
              <span>Terminal (I/O)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verter')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'verter' ? 'bg-slate-800 text-purple-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <Bot size={12} />
              <span>Verter Log</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cppcheck')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'cppcheck' ? 'bg-slate-800 text-blue-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <ShieldAlert size={12} />
              <span>Cppcheck</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearTerminal}
            className="p-1 rounded text-slate-500 hover:text-slate-300"
            title="Terminalni tozalash"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Stdin input bar (for testing with custom input) */}
        {activeTab === 'terminal' && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80">
            <span className="text-slate-400 text-[11px] font-sans">Kiruvchi oqim (stdin):</span>
            <input
              type="text"
              value={stdinValue}
              onChange={(e) => setStdinValue(e.target.value)}
              placeholder="e.g. 5 yoki 1 2 3"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Terminal Screen Logs */}
        <div className="p-3.5 max-h-48 overflow-y-auto space-y-1 text-slate-300 select-text">
          {terminalLogs.map((log, idx) => {
            const isCommand = log.startsWith('$');
            const isError = log.includes('FAIL') || log.includes('error') || log.includes('Xatolik');
            const isSuccess = log.includes('OK') || log.includes('SUCCESS') || log.includes('PASSED') || log.includes('✅');
            const isVerter = log.includes('MiniVERTER') || log.includes('VERTER RESULT');

            return (
              <div
                key={idx}
                className={`whitespace-pre-wrap leading-relaxed ${
                  isCommand
                    ? 'text-purple-400 font-bold'
                    : isError
                    ? 'text-rose-400'
                    : isSuccess
                    ? 'text-emerald-400 font-semibold'
                    : isVerter
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
