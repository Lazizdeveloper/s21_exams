import React from 'react';

/**
 * TaskExamplesTable - Renders stdin and stdout example test cases
 */
export default function TaskExamplesTable({ examples, label }) {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
            <tr>
              <th className="px-4 py-2.5 w-1/2">Kiruvchi oqim (stdin)</th>
              <th className="px-4 py-2.5 w-1/2">Kutilgan chiqish (stdout)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 font-mono">
            {examples.map((ex, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {ex.input || "(bo'sh)"}
                </td>
                <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-bold whitespace-pre-wrap">
                  {ex.output}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
