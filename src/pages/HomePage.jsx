import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Languages, 
  BookMarked,
  Code2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import CategoryCard from '../components/CategoryCard';

export default function HomePage() {
  const { t, setCurrentView, setSelectedCategory } = useApp();

  const handleSelectPractice = (cat) => {
    setSelectedCategory(cat);
    setCurrentView('practice');
  };

  const handleSelectExam = (cat) => {
    setSelectedCategory(cat);
    setCurrentView('exam');
  };

  const handleSelectCatalog = (cat) => {
    setSelectedCategory(cat);
    setCurrentView('catalog');
  };

  const totalQuestionsSum = CATEGORIES.reduce((acc, c) => acc + c.totalQuestions, 0);

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles size={14} />
            <span>«Школа 21» Exam Preparation Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t.appTitle} —{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              {t.appSubtitle}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            DevOps, C tili, SQL, Algoritmlar va Web protokollari bo'yicha barcha nazariy va amaliy imtihon savollari bitta qulay platformada. 
            O'zingizni sinab ko'ring, vaqt bilan mashq qiling va xatolaringiz ustida ishlang.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700/60">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{totalQuestionsSum} ta</div>
              <div className="text-xs text-slate-400 font-medium">Jami savollar bazasi</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{CATEGORIES.length} ta</div>
              <div className="text-xs text-slate-400 font-medium">Asosiy fanlar</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">3 ta til</div>
              <div className="text-xs text-slate-400 font-medium">UZ / RU / ENG</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Offline & Bepul</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.categories.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.categories.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onSelectPractice={handleSelectPractice}
              onSelectExam={handleSelectExam}
              onSelectCatalog={handleSelectCatalog}
            />
          ))}
        </div>
      </section>

      {/* C Practical Exam Feature Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 border border-purple-500/30 shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Code2 size={14} />
              <span>Yangi: C Amaliy Masalalar (Ex_01 — Ex_08)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              C Dasturlash bo'yicha Haqiqiy Imtihon Topshiriqlari
            </h3>
            <p className="text-sm text-purple-200/90 leading-relaxed">
              «Школа 21» amaliy imtihonlarining 35 ta masalasi: xatolarni tuzatish, kirish/chiqish formatlari, matritsalar, dinamik massivlar va strukturalar — to'liq tekshirilgan yechim kodlari bilan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('c_practice')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
          >
            <span>C Praktikani ochish</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Vaqtli Imtihon Rejimi</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Haqiqiy imtihon muhiti: 30 ta tasodifiy savol, 1 soatlik qat'iy timer va yakuniy foizli tahlil.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Batafsil Tushuntirishlar</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Har bir savolning to'g'ri javobi nima uchun aynan shundayligi bo'yicha tushuntirish va izohlar.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Languages size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">3 Tilda Qulaylik</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              O'zbekcha, Ruscha va Inglizcha interfeys hamda to'liq moslashtirilgan savollar to'plami.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
