import React from 'react';
import { X, BookOpen, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

/**
 * VerterGuideModal - Comprehensive guide explaining Verter rules and the 5 most common fatal pitfalls
 */
export default function VerterGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const PITFALLS = [
    {
      title: "1. scanf() qaytargan qiymatni tekshirmaslik",
      desc: "Agar foydalanuvchi son o'rniga harf kiritib qo'ysa va siz 'scanf' muvaffaqiyatini tekshirmasangiz, dastur axlat qiymat bilan hisoblaydi va Verter 'n/a' chiqmagani uchun 0 qo'yadi.",
      solution: "if (scanf(\"%d\", &num) != 1) { printf(\"n/a\"); return 0; }"
    },
    {
      title: "2. Ortiqcha yangi qator (\\n) qoldirish",
      desc: "School 21 topshiriqlarida 'agar shartda aytilmagan bo'lsa, oxirida \\n bo'lmasin' deyiladi. printf(\"%d\\n\", res) o'rniga faqat printf(\"%d\", res) yozing.",
      solution: "printf(\"%d\", result); // \\n qo'shilmaydi"
    },
    {
      title: "3. Clang-Format Google Style talabi",
      desc: "Imtihonda hatto bitta probel yoki tab xatosi bo'lsa ham Verter 'Style test: FAIL' deb kodni tekshirmaydi. Indentatsiya har doim 2 ta probel bo'lishi shart.",
      solution: "clang-format -i main.c // avtomatik to'g'rilash"
    },
    {
      title: "4. Xotirani tozalashni (free) unutish",
      desc: "malloc, calloc orqali olingan har qanday bayt dastur tugashidan oldin to'liq free() qilinishi shart. Aks holda Valgrind memory leak xatosini beradi.",
      solution: "free(arr); arr = NULL;"
    },
    {
      title: "5. Massiv chegarasidan chiqish (Segmentation fault)",
      desc: "Static yoki dinamik massiv indekslari [0..n-1] oralig'idan 1 ta oshsa ham, GCC AddressSanitizer dasturni yiqitadi.",
      solution: "for (int i = 0; i < n; i++) // <= n EMAS, < n"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Verter Qo'llanmasi & Oltin Qoidalar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                School 21 imtihonida talabalar eng ko'p qiladigan 5 ta xato
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Eslatma: </span>
              Verter — bu murosasiz robot. U inson emas, shu sababli kod go'zalligi va xato holatlaridagi chiqish aniqligini (0 yoki 1) tekshiradi.
            </div>
          </div>

          <div className="space-y-3">
            {PITFALLS.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon size={15} className="text-rose-500 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
                <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 font-sans mr-2">Tavsiya:</span>
                  <code>{item.solution}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
