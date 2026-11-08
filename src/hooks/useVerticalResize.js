import { useState, useEffect, useCallback } from 'react';

/**
 * useVerticalResize - Vertical drag-to-resize divider hook for IDE and Terminal
 * 
 * @param {Object} options
 * @param {React.RefObject} options.containerRef
 * @param {number} [options.defaultHeight=220]
 * @param {number} [options.minTerminalHeight=90]
 * @param {number} [options.minEditorHeight=140]
 * @param {string} [options.storageKey='s21_terminal_height']
 * @returns {{ terminalHeight: number, isDragging: boolean, handleMouseDown: Function }}
 */
export function useVerticalResize({
  containerRef,
  defaultHeight = 220,
  minTerminalHeight = 90,
  minEditorHeight = 140,
  storageKey = 's21_terminal_height'
}) {
  const [terminalHeight, setTerminalHeight] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : defaultHeight;
    } catch {
      return defaultHeight;
    }
  });

  const [isDragging, setIsDragging] = useState(false);

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
      const maxHeight = rect.height - minEditorHeight;
      const clampedHeight = Math.max(minTerminalHeight, Math.min(rawHeight, maxHeight));
      setTerminalHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      setTerminalHeight(curr => {
        try {
          localStorage.setItem(storageKey, curr.toString());
        } catch {
          // ignore
        }
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
  }, [isDragging, containerRef, minEditorHeight, minTerminalHeight, storageKey]);

  return {
    terminalHeight,
    isDragging,
    handleMouseDown
  };
}
