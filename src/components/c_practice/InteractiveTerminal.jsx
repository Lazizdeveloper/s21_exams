import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Trash2, CornerDownLeft } from 'lucide-react';

/**
 * InteractiveTerminal - Real interactive Bash terminal with prompt, command history, and Tab completion
 */
export default function InteractiveTerminal({
  shell,
  onCommandRun,
  terminalEntries,
  setTerminalEntries,
}) {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalEntries]);

  const handleKeyDown = async (e) => {
    // Arrow Up (History Prev)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (shell.history.length === 0) return;
      const nextIdx = historyIndex === -1 ? shell.history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(shell.history[nextIdx] || '');
      return;
    }

    // Arrow Down (History Next)
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= shell.history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(shell.history[nextIdx] || '');
      }
      return;
    }

    // Tab (Auto-completion)
    if (e.key === 'Tab') {
      e.preventDefault();
      const available = [
        'ls', 'ls -la', 'cat main.c', 'pwd', 'whoami',
        'clang-format -i main.c', 'clang-format -n main.c',
        'gcc -Wall -Werror -Wextra -std=c11 main.c -o a.out',
        './a.out', 'cppcheck main.c', 'verter', 'clear', 'help'
      ];
      const match = available.find(c => c.startsWith(inputVal.trim()));
      if (match) {
        setInputVal(match);
      }
      return;
    }

    // Enter (Run command)
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmdToRun = inputVal;
      setInputVal('');
      setHistoryIndex(-1);

      if (!cmdToRun.trim()) {
        setTerminalEntries(prev => [...prev, { type: 'prompt', cmd: '' }]);
        return;
      }

      // Add prompt entry
      setTerminalEntries(prev => [...prev, { type: 'prompt', cmd: cmdToRun }]);

      // Execute command in virtual shell
      const results = await shell.executeCommand(cmdToRun);

      if (results.some(r => r.type === 'clear')) {
        setTerminalEntries([]);
        return;
      }

      setTerminalEntries(prev => [...prev, ...results]);
      if (onCommandRun) onCommandRun(cmdToRun);
    }
  };

  return (
    <div 
      className="bg-slate-950 font-mono text-xs flex flex-col h-56 sm:h-64 border-t border-slate-800"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Top Header of Terminal */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon size={13} className="text-emerald-400" />
          <span className="font-bold text-slate-300">bash — 80x24 (School 21 Terminal)</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">• Tab: to'ldirish, ↑↓: tarix</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTerminalEntries([]);
          }}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Terminalni tozalash (clear)"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Terminal Screen Entries */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 select-text">
        {terminalEntries.map((entry, idx) => {
          if (entry.type === 'prompt') {
            return (
              <div key={idx} className="flex items-start gap-1.5 text-slate-200">
                <span className="text-emerald-400 font-bold shrink-0">student@s21-mac:{shell.cwd}$</span>
                <span className="text-white font-bold">{entry.cmd}</span>
              </div>
            );
          }

          if (entry.type === 'error') {
            return (
              <div key={idx} className="text-rose-400 whitespace-pre-wrap leading-relaxed pl-2 border-l-2 border-rose-500/50">
                {entry.text}
              </div>
            );
          }

          if (entry.type === 'success') {
            return (
              <div key={idx} className="text-emerald-400 whitespace-pre-wrap leading-relaxed pl-2 border-l-2 border-emerald-500/50">
                {entry.text}
              </div>
            );
          }

          if (entry.type === 'warning') {
            return (
              <div key={idx} className="text-amber-400 whitespace-pre-wrap leading-relaxed pl-2 border-l-2 border-amber-500/50">
                {entry.text}
              </div>
            );
          }

          return (
            <div key={idx} className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {entry.text}
            </div>
          );
        })}

        {/* Active Input Line */}
        <div className="flex items-center gap-1.5 text-slate-200 pt-0.5">
          <span className="text-emerald-400 font-bold shrink-0">student@s21-mac:{shell.cwd}$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none caret-emerald-400"
            placeholder="buyruq kiriting (masalan: ls, cat main.c, gcc main.c, verter)..."
          />
          <button
            type="button"
            onClick={() => handleKeyDown({ key: 'Enter', preventDefault: () => {} })}
            className="p-1 text-slate-500 hover:text-emerald-400 transition-colors sm:hidden"
          >
            <CornerDownLeft size={12} />
          </button>
        </div>

        <div ref={endRef} />
      </div>
    </div>
  );
}
