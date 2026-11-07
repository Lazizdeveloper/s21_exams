import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MarkdownView({ content }) {
  const { t } = useApp();
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!content) return null;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split content by code blocks and tables
  const renderFormattedText = (raw) => {
    // Check for code blocks ```lang ... ```
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(raw)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: raw.substring(lastIndex, match.index)
        });
      }
      parts.push({
        type: 'code',
        lang: match[1] || 'code',
        code: match[2],
        index: blockIndex++
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < raw.length) {
      parts.push({
        type: 'text',
        content: raw.substring(lastIndex)
      });
    }

    return parts.map((part, pIdx) => {
      if (part.type === 'code') {
        const isCopied = copiedIndex === part.index;
        return (
          <div key={pIdx} className="my-3 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-900 text-slate-100 shadow-md">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-xs font-mono text-slate-400 border-b border-slate-700/50">
              <span className="uppercase tracking-wider font-semibold">{part.lang || 'code'}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(part.code, part.index)}
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors py-0.5 px-1.5 rounded"
              >
                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{isCopied ? t.actions.copied : t.actions.copyCode}</span>
              </button>
            </div>
            <pre className="p-3 text-sm font-mono overflow-x-auto leading-relaxed">
              <code>{part.code}</code>
            </pre>
          </div>
        );
      }

      // Check for Markdown table
      if (part.content.includes('| --- |') || part.content.includes('|--- |')) {
        return renderTableAndText(part.content, pIdx);
      }

      // Regular text with inline `code`
      return renderInlineElements(part.content, pIdx);
    });
  };

  const renderTableAndText = (text, keyPrefix) => {
    const lines = text.split('\n');
    const elements = [];
    let tableLines = [];
    let inTable = false;

    lines.forEach((line, lIdx) => {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        tableLines.push(line);
      } else {
        if (inTable && tableLines.length > 0) {
          elements.push(buildTable(tableLines, `${keyPrefix}-tbl-${lIdx}`));
          tableLines = [];
          inTable = false;
        }
        if (line.trim()) {
          elements.push(
            <p key={`${keyPrefix}-p-${lIdx}`} className="my-1.5 text-base leading-relaxed">
              {renderInlineCodes(line)}
            </p>
          );
        }
      }
    });

    if (inTable && tableLines.length > 0) {
      elements.push(buildTable(tableLines, `${keyPrefix}-tbl-end`));
    }

    return <div key={keyPrefix}>{elements}</div>;
  };

  const buildTable = (tableLines, key) => {
    const rows = tableLines.map(r => 
      r.split('|').slice(1, -1).map(c => c.trim())
    );
    if (rows.length < 2) return null;

    const headers = rows[0];
    const dataRows = rows.slice(2); // Skip separator row

    return (
      <div key={key} className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold uppercase text-xs tracking-wider border-b border-slate-200 dark:border-slate-700">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3.5 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60 font-mono text-xs">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2 text-slate-800 dark:text-slate-300">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderInlineElements = (text, keyPrefix) => {
    const paragraphs = text.split('\n').filter(p => p.trim());
    return (
      <div key={keyPrefix} className="space-y-2">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="text-base leading-relaxed text-slate-900 dark:text-slate-100">
            {renderInlineCodes(p)}
          </p>
        ))}
      </div>
    );
  };

  const renderInlineCodes = (line) => {
    const parts = line.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 mx-0.5 text-xs font-mono rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return <div className="space-y-2">{renderFormattedText(content)}</div>;
}
