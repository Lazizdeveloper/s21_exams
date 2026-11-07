# School 21 Exams (Школа 21 Экзамены)

«Школа 21» nazariy imtihonlariga tayyorgarlik ko'rish uchun zamonaviy, tezkor va 3 tilda (🇺🇿 O'zbekcha, 🇷🇺 Русский, 🇬🇧 English) ishlovchi veb-platforma hamda to'liq ma'lumotlar bazasi.

---

## 🚀 Veb-ilovadan foydalanish

Platforma React 18, Vite va Tailwind CSS asosida qurilgan bo'lib, to'liq offline (PWA uslubida) ishlaydi.

### Ishga tushirish (Local Development):
```bash
# Kutubxonalarni o'rnatish
npm install

# Dasturni ishga tushirish (localhost:3000)
npm run dev
```

### Production build:
```bash
npm run build
npm run preview
```

---

## 🌟 Platformaning asosiy imkoniyatlari

1. **3 Tilda to'liq qo'llab-quvvatlash (i18n)**:
   - 🇺🇿 O'zbekcha | 🇷🇺 Русский | 🇬🇧 English
   - Interfeys va barcha menyular 3 tilda ishlaydi.
   - HTTP, Tarmoqlar & JavaScript savollari 3 tilda to'liq taqdim etilgan.
2. **Imtihon rejimi (Official Exam Simulation)**:
   - Tasodifiy 40 ta savol (DevOps) yoki fanga mos savollar to'plami.
   - Haqiqiy vaqt hisoblagich (Timer).
   - Imtihon yakunida aniqlik foizi (75% dan o'tish balli), xatolar tahlili va konfetti animatsiyasi.
3. **Mashq / O'rganish rejimi (Practice Mode)**:
   - Har bir savolga javob berilishi bilanoq to'g'ri/xato ekanligi ko'rinadi.
   - Har bir savolga batafsil tushuntirish va izoh (`explanation`).
   - Savollar xaritasi (Grid navigator) orqali istalgan savolga tezkor sakrash.
4. **Barcha savollar katalogi (Browse & Search)**:
   - 363 ta savol bo'yicha real vaqtda kalit so'z orqali qidiruv.
   - Jadvallar va dasturlash kodlari (SQL, JS, Bash) syntax highlighting va nusxa ko'chirish imkoniyati bilan.
5. **Tanlanganlar (Bookmarks)**:
   - Qiyin savollarni yulduzcha bilan belgilab, alohida qayta yechish.
6. **Dark / Light Mode**:
   - Ko'zni charchatmaydigan ergonomik qorong'i va yorug' mavzular (localStorage'da saqlanadi).

---

## 📚 Jamlangan fanlar va savollar bazasi

### 1. DevOps (Теория)
- **Manba**: [widum.ru/s21/devops/](https://widum.ru/s21/devops/)
- **Savollar soni**: 286 ta (radio va checkbox)
- **Fayl**: `devops_exam_questions.json`
- **Mavzular**: Docker, Kubernetes, Linux (bash/sh), CI/CD, tarmoqlar, monitoring.

### 2. C (Теория)
- **Manba**: [widum.ru/s21/c-theory/](https://widum.ru/s21/c-theory/)
- **Savollar soni**: 24 ta (radio va checkbox)
- **Fayl**: `c_theory_exam_questions.json`
- **Mavzular**: C tili asoslari, malloc/free, ko'rsatkichlar (pointers), strukturalar, Unix tizimi.

### 3. SQL (Теория и практика)
- **Manba**: [widum.ru/s21/sql/](https://widum.ru/s21/sql/)
- **Savollar soni**: 30 ta (nazariy va amaliy savollar jadvallar hamda SQL kodlar bilan)
- **Fayl**: `sql_exam_questions.json`
- **Mavzular**: ACID, CAP-teoremasi, JOIN, GROUP BY, amaliy so'rovlar natijasini topish.

### 4. HTTP, Tarmoqlar va JavaScript (Multilingual: UZ / RU / ENG)
- **Fayllar**: 
  - `http_js_exam_multilingual.json` — 3 ta tilda birlashtirilgan yagona dataset
  - `http_js_exam_UZ.json`, `http_js_exam_RU.json`, `http_js_exam_ENG.json`
- **Savollar soni**: 23 ta (ES6+, klasslar, private metodlar, tarmoq protokollari).
- **Asl hujjatlar**: `exam-questions-UZB.docx`, `exam-questions-RUS.docx`, `exam-questions-ENG.docx`
