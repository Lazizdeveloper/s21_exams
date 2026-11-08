import React, { useState, useMemo, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  RotateCcw, 
  Terminal as TerminalIcon, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import { VirtualShell } from '../../utils/virtualTerminalService';
import { useVerticalResize } from '../../hooks/useVerticalResize';
import InteractiveTerminal from './InteractiveTerminal';

/**
 * CodeEditorTerminal - In-browser VS Code (Monaco) Editor with Interactive Bash Terminal
 * Includes draggable divider to resize IDE and Terminal, and Fullscreen mode toggle.
 */
export default function CodeEditorTerminal({
  code,
  onChangeCode,
  activeTask,
  onResetOriginal,
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hook for smooth drag-to-resize divider
  const { terminalHeight, isDragging, handleMouseDown } = useVerticalResize({
    containerRef,
    defaultHeight: 220,
    minTerminalHeight: 90,
    minEditorHeight: 140,
    storageKey: 's21_terminal_height'
  });

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

  // Toggle Fullscreen (both CSS fixed full screen and Browser Fullscreen API)
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (containerRef.current?.requestFullscreen && !document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Sync fullscreen state with browser exit (e.g. user pressed Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-white dark:bg-slate-900 shadow-md overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen'
          : 'rounded-2xl border border-slate-200 dark:border-slate-800 h-full relative'
      }`}
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

          {/* Full Screen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-semibold text-[11px] border ${
              isFullscreen
                ? 'bg-purple-600 text-white border-purple-500 hover:bg-purple-500 shadow-xs'
                : 'text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
            title={isFullscreen ? "To'liq ekrandan chiqish (Esc)" : "To'liq ekranga yoyish (Full Screen)"}
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            <span>{isFullscreen ? "Kichraytirish" : "To'liq ekran"}</span>
          </button>
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
