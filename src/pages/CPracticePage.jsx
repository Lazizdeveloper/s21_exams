import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Terminal, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import cPracticalData from '../data/c_practical.json';
import MarkdownView from '../components/MarkdownView';

// Subcomponents
import TaskListItem from '../components/c_practice/TaskListItem';
import TaskHeader from '../components/c_practice/TaskHeader';
import TaskExamplesTable from '../components/c_practice/TaskExamplesTable';
import TaskCodeViewer from '../components/c_practice/TaskCodeViewer';
import VerterCheckerModal from '../components/c_practice/VerterCheckerModal';
import VerterGuideModal from '../components/c_practice/VerterGuideModal';

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
  const [activeCodeTab, setActiveCodeTab] = useState('solution');
  const [copied, setCopied] = useState(false);
  
  // Modals state
  const [isVerterOpen, setIsVerterOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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

      {/* Main Grid: Left Tasks (4 col) + Right Details (8 col) */}
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
            filteredTasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                isCurrent={task.id === activeTask.id}
                title={getTaskTitle(task)}
                topics={getTaskTopics(task)}
                onSelect={() => {
                  setActiveTaskId(task.id);
                  setActiveCodeTab('solution');
                }}
              />
            ))
          )}
        </div>

        {/* Right: Task Details & Verter Inspector */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {activeTask ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
              {/* Task Header with Verter Actions */}
              <TaskHeader
                activeTask={activeTask}
                title={getTaskTitle(activeTask)}
                topics={getTaskTopics(activeTask)}
                onOpenVerter={() => setIsVerterOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
              />

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
              <TaskExamplesTable 
                examples={activeTask.examples} 
                label={t.cPractice.examples} 
              />

              {/* School 21 Exam Requirement Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle size={15} />
                  <span>{t.cPractice.notes}</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 dark:text-amber-300/90 pl-1">
                  <li>Noto'g'ri kiritishda faqat <code className="font-mono font-bold bg-amber-100 dark:bg-amber-900/60 px-1 rounded">"n/a"</code> chiqariladi.</li>
                  <li>Chiqarish oxirida ortiqcha <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">\n</code> bo'lmasligi kerak.</li>
                  <li>Dinamik xotira (<code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">malloc</code>) ishlatilgan bo'lsa, uni tozalash (<code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">free</code>) shart.</li>
                </ul>
              </div>

              {/* Code Viewer Box */}
              <TaskCodeViewer
                activeCodeTab={activeCodeTab}
                setActiveCodeTab={setActiveCodeTab}
                activeTask={activeTask}
                copied={copied}
                onCopyCode={handleCopyCode}
                solutionLabel={t.cPractice.solutionCode}
                originalLabel={t.cPractice.originalCode}
                copyLabel={t.actions.copyCode}
                copiedLabel={t.actions.copied}
              />
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              {t.cPractice.noTasksFound}
            </div>
          )}
        </div>
      </div>

      {/* Verter Modals */}
      <VerterCheckerModal
        isOpen={isVerterOpen}
        onClose={() => setIsVerterOpen(false)}
        activeTask={activeTask}
        lang={lang}
      />

      <VerterGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
