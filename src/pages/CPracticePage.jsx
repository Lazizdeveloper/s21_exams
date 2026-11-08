import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import cPracticalData from '../data/c_practical.json';

// Modular Subcomponents
import TaskListItem from '../components/c_practice/TaskListItem';
import TaskDetailsPanel from '../components/c_practice/TaskDetailsPanel';
import CodeEditorTerminal from '../components/c_practice/CodeEditorTerminal';
import VerterCheckerModal from '../components/c_practice/VerterCheckerModal';
import VerterGuideModal from '../components/c_practice/VerterGuideModal';

const EXERCISE_MODULES = [
  { id: 'all', title: { uz: 'Hammasi', ru: 'Все', en: 'All' } },
  { id: 'Ex_01', title: { uz: 'Ex_01: Xatolar', ru: 'Ex_01: Ошибки', en: 'Ex_01: Errors' } },
  { id: 'Ex_02', title: { uz: 'Ex_02: Formatli I/O', ru: 'Ex_02: Ввод/вывод', en: 'Ex_02: I/O' } },
  { id: 'Ex_03', title: { uz: 'Ex_03: Mantiq', ru: 'Ex_03: Логика', en: 'Ex_03: Logic' } },
  { id: 'Ex_04', title: { uz: 'Ex_04: Sikllar', ru: 'Ex_04: Циклы', en: 'Ex_04: Loops' } },
  { id: 'Ex_05', title: { uz: 'Ex_05: Dinamik xotira', ru: 'Ex_05: Динамич. память', en: 'Ex_05: Memory' } },
  { id: 'Ex_06', title: { uz: 'Ex_06: Matritsalar', ru: 'Ex_06: Матрицы', en: 'Ex_06: Matrices' } },
  { id: 'Ex_07', title: { uz: 'Ex_07: Satrlar', ru: 'Ex_07: Строки', en: 'Ex_07: Strings' } },
  { id: 'Ex_08', title: { uz: 'Ex_08: Strukturalar', ru: 'Ex_08: Структуры', en: 'Ex_08: Structs' } },
];

export default function CPracticePage() {
  const { lang, t, setCurrentView } = useApp();
  const [selectedModule, setSelectedModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTaskId, setActiveTaskId] = useState('ex_01_01');
  
  // Active student code in Monaco Editor
  const [userCode, setUserCode] = useState('');
  
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

  // Load code from LocalStorage or initialize with original buggy code
  useEffect(() => {
    if (!activeTask) return;
    const saved = localStorage.getItem(`s21_code_${activeTask.id}`);
    if (saved) {
      setUserCode(saved);
    } else {
      setUserCode(activeTask.originalCode || activeTask.solutionCode || '');
    }
  }, [activeTask?.id]);

  // Update user code & persist to LocalStorage
  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    if (activeTask) {
      localStorage.setItem(`s21_code_${activeTask.id}`, newCode);
    }
  };

  const handleResetOriginal = () => {
    if (window.confirm("Barcha o'zgarishlarni bekor qilib, masalaning asl xatoli kodini qaytarmoqchimisiz?")) {
      handleCodeChange(activeTask?.originalCode || '');
    }
  };

  const handleLoadSolution = () => {
    if (window.confirm("Yechim kodini muharrirga yuklamoqchimisiz?")) {
      handleCodeChange(activeTask?.solutionCode || '');
    }
  };

  const getTaskTitle = (task) => task.title[lang] || task.title.uz || task.title.ru || task.id;
  const getTaskTopics = (task) => task.topics[lang] || task.topics.uz || task.topics.ru || '';
  const getTaskDesc = (task) => task.description[lang] || task.description.uz || task.description.ru || '';

  return (
    <div className="w-full h-full flex flex-col overflow-hidden px-2 sm:px-4 py-2 space-y-2 select-none">
      {/* Top Compact Bar: Back, Modules Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t.actions.backHome}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-slate-900 dark:text-white hidden sm:inline">
              C Praktika
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {exercises.length} ta masala
            </span>
          </div>
        </div>

        {/* Module Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
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
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{mod.title[lang] || mod.title.uz}</span>
                <span className={`px-1 py-0.2 rounded text-[9px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Search Box */}
        <div className="relative w-40 sm:w-56">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qidirish..."
            className="w-full pl-7 pr-3 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Main Full-Height Workspace: Left Panel (3-4 cols) + Right Big IDE (8-9 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left Column: Tasks Mini-List & Full Task Details (Scrolls independently) */}
        <div className="lg:col-span-4 xl:col-span-3 h-full flex flex-col min-h-0 space-y-2 overflow-hidden select-text">
          {/* Quick Task Switcher Mini-List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 h-36 shrink-0 overflow-y-auto space-y-1 scrollbar-thin">
            <div className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Masalalar ({filteredTasks.length})</span>
              <span>Daraja</span>
            </div>
            {filteredTasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                isCurrent={task.id === activeTask?.id}
                title={getTaskTitle(task)}
                topics={getTaskTopics(task)}
                onSelect={() => setActiveTaskId(task.id)}
              />
            ))}
          </div>

          {/* Task Instructions & Tests & Hints */}
          {activeTask && (
            <div className="flex-1 min-h-0 overflow-hidden">
              <TaskDetailsPanel
                activeTask={activeTask}
                title={getTaskTitle(activeTask)}
                topics={getTaskTopics(activeTask)}
                desc={getTaskDesc(activeTask)}
                onOpenVerter={() => setIsVerterOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
                onLoadSolutionToEditor={handleLoadSolution}
              />
            </div>
          )}
        </div>

        {/* Right Column: Full-Height VS Code IDE (Monaco Editor) + Interactive Terminal */}
        <div className="lg:col-span-8 xl:col-span-9 h-full flex flex-col min-h-0 overflow-hidden select-text">
          {activeTask ? (
            <CodeEditorTerminal
              code={userCode}
              onChangeCode={handleCodeChange}
              activeTask={activeTask}
              onResetOriginal={handleResetOriginal}
              onLoadSolution={handleLoadSolution}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
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
