import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Terminal as TerminalIcon } from 'lucide-react';
import { VirtualShell } from '../../utils/virtualTerminalService';
import InteractiveTerminal from './InteractiveTerminal';

const DEFAULT_TERMINAL_HEIGHT = 220;
const MIN_TERMINAL_HEIGHT = 90;
const MIN_EDITOR_HEIGHT = 140;

/**
 * CodeEditorTerminal - In-browser VS Code (Monaco) Editor with Interactive Bash Terminal
 * Includes draggable divider to resize IDE and Terminal vertically (VS Code style).
 */
export default function CodeEditorTerminal({
  code,
  onChangeCode,
  activeTask,
  onResetOriginal,
}) {
  const containerRef = useRef(null);
  const [terminalHeight, setTerminalHeight] = useState(() => {
    const saved = localStorage.getItem('s21_terminal_height');
    return saved ? parseInt(saved, 10) : DEFAULT_TERMINAL_HEIGHT;
  });
  const [isDragging, setIsDragging] = useState(false);

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

  // Drag-to-resize divider handlers
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawHeight = rect.bottom - e.clientY;
      const maxHeight = rect.height - MIN_EDITOR_HEIGHT;
      const clampedHeight = Math.max(MIN_TERMINAL_HEIGHT, Math.min(rawHeight, maxHeight));
      setTerminalHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      setTerminalHeight(curr => {
        localStorage.setItem('s21_terminal_height', curr.toString());
        return curr;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden h-full relative"
    >
      {/* Top VS Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0 select-none">
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
        </div>
      </div>

      {/* Monaco Code Editor (Flex-1, dynamically resizes with terminal) */}
      <div className="flex-1 w-full bg-slate-950 relative min-h-[140px] overflow-hidden">
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

      {/* Drag-to-Resize Divider Handle (VS Code style) */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-2.5 w-full cursor-row-resize flex items-center justify-center select-none group relative z-20 transition-colors ${
          isDragging 
            ? 'bg-purple-600 shadow-sm' 
            : 'bg-slate-200/80 dark:bg-slate-800/90 hover:bg-purple-500/70 border-t border-b border-slate-300/60 dark:border-slate-700/60'
        }`}
        title="O'lchamni o'zgartirish: yuqoriga yoki pastga suring"
      >
        <div className="w-12 h-1 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-white transition-colors" />
      </div>

      {/* Terminal Header Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono pl-1">
          <TerminalIcon size={13} className="text-emerald-500" />
          <span className="text-[11px]">
            School 21 Terminal: <code className="text-slate-700 dark:text-slate-300">gcc main.c</code> • <code className="text-slate-700 dark:text-slate-300">./a.out</code> • <code className="text-slate-700 dark:text-slate-300">clang-format -i main.c</code> • <code className="text-slate-700 dark:text-slate-300">cppcheck main.c</code>
          </span>
        </div>
      </div>

      {/* Resizable Interactive Bash Terminal */}
      <InteractiveTerminal
        shell={shell}
        terminalEntries={terminalEntries}
        setTerminalEntries={setTerminalEntries}
        height={terminalHeight}
      />
    </div>
  );
}
