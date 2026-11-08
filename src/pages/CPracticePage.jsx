import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import cPracticalData from '../data/c_practical.json';
import { createFreshExamSession } from '../utils/examGenerator';

// Modular Subcomponents
import ExamStepperBar from '../components/c_practice/ExamStepperBar';
import TaskListItem from '../components/c_practice/TaskListItem';
import TaskDetailsPanel from '../components/c_practice/TaskDetailsPanel';
import CodeEditorTerminal from '../components/c_practice/CodeEditorTerminal';
import VerterCheckerModal from '../components/c_practice/VerterCheckerModal';
import VerterGuideModal from '../components/c_practice/VerterGuideModal';

export default function CPracticePage() {
  const { lang, t, setCurrentView } = useApp();
  const allExercises = useMemo(() => cPracticalData.exercises || [], []);

  // Current session's 5 progressive exam tasks (Level 1 -> Level 5)
  // Har safar kirganda avvalgisidan farqli 5 ta tasodifiy savol yaratiladi
  const [examTasks, setExamTasks] = useState(() => createFreshExamSession(allExercises));
  const [activeTaskId, setActiveTaskId] = useState(() => examTasks[0]?.id || 'ex_01_01');
  
  // Active student code in Monaco Editor
  const [userCode, setUserCode] = useState('');
  
  // Modals state
  const [isVerterOpen, setIsVerterOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Active task object
  const activeTask = useMemo(() => {
    return examTasks.find(t => t.id === activeTaskId) || examTasks[0] || allExercises[0];
  }, [examTasks, activeTaskId, allExercises]);

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
  const handleCodeChange = useCallback((newCode) => {
    setUserCode(newCode);
    if (activeTask) {
      localStorage.setItem(`s21_code_${activeTask.id}`, newCode);
    }
  }, [activeTask]);

  // Shuffle / Generate new 5 exam tasks
  const handleShuffleExam = useCallback(() => {
    const freshTasks = createFreshExamSession(allExercises);
    setExamTasks(freshTasks);
    if (freshTasks.length > 0) {
      setActiveTaskId(freshTasks[0].id);
    }
  }, [allExercises]);

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
      {/* Top Stepper Bar: Back, 5 Level Steps & Shuffle */}
      <ExamStepperBar
        tasks={examTasks}
        activeTaskId={activeTask?.id}
        onSelectTask={(id) => setActiveTaskId(id)}
        onShuffle={handleShuffleExam}
        onBackHome={() => setCurrentView('home')}
        lang={lang}
      />

      {/* Main Full-Height Workspace: Left Panel (3-4 cols) + Right Big IDE (8-9 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left Column: 5 Questions Mini-List & Active Task Details */}
        <div className="lg:col-span-4 xl:col-span-3 h-full flex flex-col min-h-0 space-y-2 overflow-hidden select-text">
          {/* 5 Questions Switcher List (Scrollsiz, to'liq 5 ta savol) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 h-[252px] shrink-0 flex flex-col justify-between space-y-1">
            <div className="px-1.5 py-0.5 text-[10px] font-black text-slate-400 uppercase tracking-wider flex justify-between items-center shrink-0">
              <span>Imtihon savollari (5 ta)</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Level 1 → 5</span>
            </div>
            <div className="space-y-1 flex-1 flex flex-col justify-between">
              {examTasks.map((task) => (
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
              {t.cPractice?.noTasksFound || 'Masalalar topilmadi'}
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
