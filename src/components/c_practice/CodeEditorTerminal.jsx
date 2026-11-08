import React, { useState, useMemo, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  CheckCircle2, 
  RotateCcw, 
  FileCode, 
  Loader2,
  Terminal as TerminalIcon
} from 'lucide-react';
import { VirtualShell } from '../../utils/virtualTerminalService';
import InteractiveTerminal from './InteractiveTerminal';

/**
 * CodeEditorTerminal - In-browser VS Code (Monaco) Editor with Interactive Bash Terminal
 * Tools (gcc, clang-format, cppcheck) are run directly inside the terminal.
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
      text: 'School 21 Interactive Workstation v1.0 (x86_64-linux-gnu)\nFayllar ro\'yxati: "ls" • O\'qish: "cat main.c" • Formatlash: "clang-format -i main.c"\nStatik tahlil: "cppcheck main.c" • Kompilyatsiya: "gcc main.c" • Ishga tushirish: "./a.out"',
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

  // Submit & Check code evaluation
  const handleCheckCode = async () => {
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
      <div className="h-[340px] sm:h-[390px] w-full bg-slate-950 relative">
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

      {/* Terminal Bar & Check Code Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono pl-1">
          <TerminalIcon size={14} className="text-emerald-500" />
          <span className="text-[11px]">
            Buyruqlar: <code className="text-slate-700 dark:text-slate-300">gcc main.c</code>, <code className="text-slate-700 dark:text-slate-300">clang-format -i main.c</code>, <code className="text-slate-700 dark:text-slate-300">cppcheck main.c</code>, <code className="text-slate-700 dark:text-slate-300">./a.out</code>
          </span>
        </div>

        <button
          type="button"
          disabled={isRunning}
          onClick={handleCheckCode}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-purple-500/25 transition-all hover:scale-[1.02]"
          title="Kodni to'liq avtotestlar orqali tekshirish"
        >
          {isRunning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          <span>Kodni tekshirish</span>
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
