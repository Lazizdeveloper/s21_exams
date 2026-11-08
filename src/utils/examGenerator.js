/**
 * Exam Tasks Generator Service
 * School 21 imtihon tizimi talablariga muvofiq:
 * Har safar kirganda qiyinlashib boruvchi 5 ta tasodifiy yangi masala (Level 1 -> Level 5)
 */

export const EXAM_LEVELS_COUNT = 5;
const LAST_EXAM_IDS_KEY = 's21_last_generated_exam_ids';

/**
 * Massivdan tasodifiy bitta elementni tanlash
 */
const pickRandomItem = (array) => {
  if (!array || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

/**
 * 5 ta qiyinlashib boruvchi tasodifiy imtihon masalalarini tanlash
 * 
 * @param {Array} allExercises - c_practical.json dagi barcha masalalar ro'yxati
 * @param {Array<string>} [excludeIds=[]] - Oldingi safargi takrorlanishning oldini olish uchun ID lar
 * @returns {Array} 5 ta tasodifiy masala (Level 1 -> Level 5, har birida questionNumber: 1..5)
 */
export function generateRandomExamTasks(allExercises, excludeIds = []) {
  if (!Array.isArray(allExercises) || allExercises.length === 0) {
    return [];
  }

  // Darajalar bo'yicha guruhlash (School 21 imtihon standartiga mos)
  // Savol 1: Level 1 (sintaksis xatolar va formatli I/O)
  // Savol 2: Level 2 (mantiq va hisoblash)
  // Savol 3: Level 3 (sikllar, massivlar, oddiy satrlar)
  // Savol 4: Level 4 (dinamik xotira, matritsalar, satr amallari)
  // Savol 5: Level 5/6 (murakkab algoritmlar, strukturalar, spiral)
  const level1Pool = allExercises.filter(e => e.level === 1);
  const level2Pool = allExercises.filter(e => e.level === 2);
  const level3Pool = allExercises.filter(e => e.level === 3);
  const level4Pool = allExercises.filter(e => e.level === 4);
  const level5Pool = allExercises.filter(e => e.level >= 5);

  const pools = [level1Pool, level2Pool, level3Pool, level4Pool, level5Pool];

  const selectedTasks = [];
  const pickedIds = new Set();
  const excludeSet = new Set(excludeIds || []);

  pools.forEach((pool, index) => {
    const questionNumber = index + 1;
    
    // 1. Oldingi safar tushmagan va hozir tanlanmagan masalalar
    let candidates = pool.filter(e => !excludeSet.has(e.id) && !pickedIds.has(e.id));
    
    // 2. Agar barcha masalalar oldingi safar tushgan bo'lsa (kichik pool bo'lsa), faqat hozir tanlanmaganlarini olamiz
    if (candidates.length === 0) {
      candidates = pool.filter(e => !pickedIds.has(e.id));
    }
    
    // 3. Zaxira fallback
    if (candidates.length === 0) {
      candidates = allExercises.filter(e => !pickedIds.has(e.id));
    }

    const picked = pickRandomItem(candidates) || pool[0] || allExercises[0];
    
    if (picked) {
      pickedIds.add(picked.id);
      selectedTasks.push({
        ...picked,
        questionNumber
      });
    }
  });

  // Yangi generatsiya qilingan ID larni saqlab qo'yamiz (keyingi safar yangi tushishi uchun)
  try {
    const newIds = selectedTasks.map(t => t.id);
    localStorage.setItem(LAST_EXAM_IDS_KEY, JSON.stringify(newIds));
  } catch {
    // ignore
  }

  return selectedTasks;
}

/**
 * Sahifaga yangi kirilganda yoki yangilaganda yangi 5 ta savol to'plamini olish
 */
export function createFreshExamSession(allExercises) {
  let prevIds = [];
  try {
    const saved = localStorage.getItem(LAST_EXAM_IDS_KEY);
    if (saved) prevIds = JSON.parse(saved);
  } catch {
    prevIds = [];
  }
  return generateRandomExamTasks(allExercises, prevIds);
}
