import React, { useState, useMemo, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Sparkles, 
  ShieldAlert, 
  Bot, 
  RotateCcw, 
  FileCode, 
  Loader2
} from 'lucide-react';
import { VirtualShell } from '../../utils/virtualTerminalService';
import InteractiveTerminal from './InteractiveTerminal';

/**
 * CodeEditorTerminal - In-browser VS Code (Monaco) Editor with Interactive Bash Terminal
 */
export default function CodeEditorTerminal({
  code,
  onChangeCode,
  activeTask,
  onResetOriginal,
  onLoadSolution,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [terminalEntries, setTerminalEntries] = useState([
    {
      type: 'output',
      text: 'School 21 Interactive Workstation v1.0 (x86_64-linux-gnu)\nFayllarni ko\'rish uchun "ls", o\'qish uchun "cat main.c", kompilyatsiya uchun "gcc main.c", tekshirish uchun "verter" deb yozing.',
    },
  ]);

  // Create Virtual Shell instance
  const shell = useMemo(() => {
    return new VirtualShell({
      getCode: () => code,
      setCode: (newCode) => onChangeCode(newCode),
      activeTask,
    });
  }, [activeTask]);

  // Sync latest code and task with shell
  useEffect(() => {
    shell.updateContext({
      getCode: () => code,
      setCode: (newCode) => onChangeCode(newCode),
      activeTask,
    });
  }, [code, activeTask, shell]);

  // Quick Action Button: Clang-Format
  const handleQuickFormat = async () => {
    setTerminalEntries(prev => [...prev, { type: 'prompt', cmd: 'clang-format -i main.c' }]);
    const res = await shell.executeCommand('clang-format -i main.c');
    setTerminalEntries(prev => [...prev, ...res]);
  };

  // Quick Action Button: Cppcheck
  const handleQuickCppcheck = async () => {
    setTerminalEntries(prev => [...prev, { type: 'prompt', cmd: 'cppcheck main.c' }]);
    const res = await shell.executeCommand('cppcheck main.c');
    setTerminalEntries(prev => [...prev, ...res]);
  };

  // Quick Action Button: Run (GCC + ./a.out)
  const handleQuickRun = async () => {
    setIsRunning(true);
    setTerminalEntries(prev => [
      ...prev,
      { type: 'prompt', cmd: 'gcc -Wall -Werror -Wextra -std=c11 main.c -o a.out && ./a.out' },
    ]);

    const gccRes = await shell.executeCommand('gcc main.c');
    setTerminalEntries(prev => [...prev, ...gccRes]);

    if (!gccRes.some(r => r.type === 'error')) {
      const runRes = await shell.executeCommand('./a.out');
      setTerminalEntries(prev => [...prev, ...runRes]);
    }

    setIsRunning(false);
  };

  // Quick Action Button: Verter Test
  const handleQuickVerter = async () => {
    setIsRunning(true);
    setTerminalEntries(prev => [...prev, { type: 'prompt', cmd: 'verter' }]);
    const res = await shell.executeCommand('verter');
    setTerminalEntries(prev => [...prev, ...res]);
    setIsRunning(false);
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
      <div className="h-[340px] sm:h-[380px] w-full bg-slate-950 relative">
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

      {/* Quick Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={isRunning}
            onClick={handleQuickRun}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02]"
            title="Kodni gcc orqali kompilyatsiya qilib, a.out ni ishga tushirish"
          >
            {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
            <span>Ishga tushirish (Run)</span>
          </button>

          <button
            type="button"
            onClick={handleQuickFormat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            title="Google Style bo'yicha avtomatik formatlash (clang-format -i main.c)"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>Clang-Format</span>
          </button>

          <button
            type="button"
            onClick={handleQuickCppcheck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            title="Statik kod tahlili (cppcheck main.c)"
          >
            <ShieldAlert size={13} className="text-blue-500" />
            <span>Cppcheck</span>
          </button>
        </div>

        <button
          type="button"
          disabled={isRunning}
          onClick={handleQuickVerter}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-purple-500/25 transition-all hover:scale-[1.02]"
          title="Verter avtotest tizimini ishga tushirish (verter)"
        >
          <Bot size={14} />
          <span>🤖 Verter Tekshiruvi</span>
        </button>
      </div>

      {/* Real Interactive Bash Terminal */}
      <InteractiveTerminal
        shell={shell}
        terminalEntries={terminalEntries}
        setTerminalEntries={setTerminalEntries}
      />
    </div>
  );
}
