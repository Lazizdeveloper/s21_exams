import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Search, 
  Copy, 
  Check, 
  ArrowLeft, 
  Terminal, 
  AlertTriangle, 
  FileCode, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import cPracticalData from '../data/c_practical.json';
import MarkdownView from '../components/MarkdownView';

const EXERCISE_MODULES = [
  { id: 'all', title: { uz: 'Hammasi', ru: 'Все', en: 'All' } },
  { id: 'Ex_01', title: { uz: 'Ex_01: Xatolarni tuzatish', ru: 'Ex_01: Исправление ошибок', en: 'Ex_01: Fixing errors' } },
  { id: 'Ex_02', title: { uz: 'Ex_02: Formatli chiqarish', ru: 'Ex_02: Ввод/вывод данных', en: 'Ex_02: Formatted I/O' } },
  { id: 'Ex_03', title: { uz: 'Ex_03: Mantiq & Ifodalar', ru: 'Ex_03: Логика и выражения', en: 'Ex_03: Logic & Math' } },
  { id: 'Ex_04', title: { uz: 'Ex_04: Sikllar & Funksiyalar', ru: 'Ex_04: Циклы и структуры', en: 'Ex_04: Loops & Control' } },
  { id: 'Ex_05', title: { uz: 'Ex_05: Dinamik massivlar', ru: 'Ex_05: Динамические массивы', en: 'Ex_05: Dynamic arrays' } },
  { id: 'Ex_06', title: { uz: 'Ex_06: Matritsalar', ru: 'Ex_06: Матрицы', en: 'Ex_06: Matrices' } },
  { id: 'Ex_07', title: { uz: 'Ex_07: Satrlar (Strings)', ru: 'Ex_07: Строки (Strings)', en: 'Ex_07: Strings' } },
  { id: 'Ex_08', title: { uz: 'Ex_08: Strukturalar', ru: 'Ex_08: Структуры (struct)', en: 'Ex_08: Structures' } },
];

export default function CPracticePage() {
  const { lang, t, setCurrentView } = useApp();
  const [selectedModule, setSelectedModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTaskId, setActiveTaskId] = useState('ex_01_01');
  const [activeCodeTab, setActiveCodeTab] = useState('solution'); // 'solution' | 'original'
  const [copied, setCopied] = useState(false);

  const exercises = cPracticalData.exercises || [];

  // Filter tasks by module and search query
  const filteredTasks = useMemo(() => {
    return exercises.filter(task => {
      const matchModule = selectedModule === 'all' || task.exerciseGroup === selectedModule;
      if (!matchModule) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (task.title[lang] || task.title.uz || '').toLowerCase();
      const topics = (task.topics[lang] || task.topics.uz || '').toLowerCase();
      const desc = (task.description[lang] || task.description.uz || '').toLowerCase();
      return title.includes(q) || topics.includes(q) || desc.includes(q) || task.id.includes(q);
    });
  }, [exercises, selectedModule, searchQuery, lang]);

  // Active task object
  const activeTask = useMemo(() => {
    return exercises.find(t => t.id === activeTaskId) || filteredTasks[0] || exercises[0];
  }, [exercises, activeTaskId, filteredTasks]);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTaskTitle = (task) => task.title[lang] || task.title.uz || task.title.ru || task.id;
  const getTaskTopics = (task) => task.topics[lang] || task.topics.uz || task.topics.ru || '';
  const getTaskDesc = (task) => task.description[lang] || task.description.uz || task.description.ru || '';

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t.actions.backHome}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {t.cPractice.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {exercises.length} ta masala
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.cPractice.subtitle}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.cPractice.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Module Selector Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {EXERCISE_MODULES.map((mod) => {
          const isSelected = selectedModule === mod.id;
          const count = mod.id === 'all' 
            ? exercises.length 
            : exercises.filter(e => e.exerciseGroup === mod.id).length;

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => {
                setSelectedModule(mod.id);
                // If current task is not in new module, select first task of module
                if (mod.id !== 'all') {
                  const firstOfMod = exercises.find(e => e.exerciseGroup === mod.id);
                  if (firstOfMod) setActiveTaskId(firstOfMod.id);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{mod.title[lang] || mod.title.uz}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Task List (1/3) + Right Task Details (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Task Navigation List */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 max-h-[calc(100vh-280px)] overflow-y-auto space-y-1.5">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Masalalar ({filteredTasks.length})</span>
            <span>Daraja</span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              {t.cPractice.noTasksFound}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCurrent = task.id === activeTask.id;
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setActiveTaskId(task.id);
                    setActiveCodeTab('solution');
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 shadow-sm ring-1 ring-purple-500/30'
                      : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold font-mono tracking-tight text-purple-600 dark:text-purple-400">
                      {task.id.toUpperCase()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      Level {task.level}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold line-clamp-1">
                    {getTaskTitle(task)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {getTaskTopics(task)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Task Details & Code Viewer */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {activeTask ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              {/* Task Header */}
              <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500 text-white shadow-sm">
                    {activeTask.exerciseGroup}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Level {activeTask.level}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {activeTask.id}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {getTaskTitle(activeTask)}
                </h2>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Mavzu:</span>
                  <span>{getTaskTopics(activeTask)}</span>
                </div>
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal size={16} className="text-purple-500" />
                  <span>{t.cPractice.taskDetails}</span>
                </h3>
                <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <MarkdownView content={getTaskDesc(activeTask)} />
                </div>
              </div>

              {/* Examples (Input -> Output) */}
              {activeTask.examples && activeTask.examples.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t.cPractice.examples}
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
                        {activeTask.examples.map((ex, idx) => (
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
              )}

              {/* School 21 Exam Requirement Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle size={15} />
                  <span>{t.cPractice.notes}</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 dark:text-amber-300/90 pl-1">
                  <li>Har qanday noto'g'ri kiritishda faqat <code className="font-mono font-bold bg-amber-100 dark:bg-amber-900/60 px-1 rounded">"n/a"</code> chiqarilishi shart.</li>
                  <li>Chiqarish oxirida yangi qatorga o'tish (<code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">\n</code>) bo'lmasligi kerak (agar shartda alohida aytilmagan bo'lsa).</li>
                  <li>Dinamik xotira (<code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">malloc</code>) ishlatilgan bo'lsa, uni tozalash (<code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">free</code>) majburiydir.</li>
                </ul>
              </div>

              {/* Code Viewer Box with Tabs (Solution vs Original Buggy Code) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('solution')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        activeCodeTab === 'solution'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Check size={14} />
                      <span>{t.cPractice.solutionCode}</span>
                    </button>

                    {activeTask.originalCode && (
                      <button
                        type="button"
                        onClick={() => setActiveCodeTab('original')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                          activeCodeTab === 'original'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <FileCode size={14} />
                        <span>{t.cPractice.originalCode}</span>
                      </button>
                    )}
                  </div>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeCodeTab === 'solution' ? activeTask.solutionCode : activeTask.originalCode)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copied ? t.actions.copied : t.actions.copyCode}</span>
                  </button>
                </div>

                {/* Code Block Container */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-bold text-slate-300">main.c</span>
                    </div>
                    <span>C (C99 / School 21)</span>
                  </div>

                  <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-400 leading-relaxed max-h-[460px]">
                    <code>{activeCodeTab === 'solution' ? activeTask.solutionCode : activeTask.originalCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              {t.cPractice.noTasksFound}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
