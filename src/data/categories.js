import devopsData from './devops.json';
import cTheoryData from './c_theory.json';
import sqlData from './sql.json';
import httpJsData from './http_js.json';
import algorithmsData from './algorithms.json';

export const DEFAULT_PRACTICE_COUNT = 30;
export const DEFAULT_EXAM_COUNT = 30;
export const DEFAULT_EXAM_DURATION_MINUTES = 60;

export const getPassingScorePercent = (categoryId) => {
  return categoryId === 'devops' ? 80 : 50;
};

export const CATEGORIES = [
  {
    id: 'devops',
    key: 'devops',
    icon: 'Terminal',
    color: 'from-blue-600 to-indigo-600',
    totalQuestions: devopsData.questions.length,
    practiceQuestionCount: 30,
    examQuestionCount: 30,
    examDurationMinutes: 60,
    passingScorePercent: 80, // DevOps exam requires 80% to pass
    isMultilingual: true,
    rawQuestions: devopsData.questions,
  },
  {
    id: 'algorithms',
    key: 'algorithms',
    icon: 'Network',
    color: 'from-cyan-500 to-blue-600',
    totalQuestions: algorithmsData.questions.length,
    practiceQuestionCount: 30,
    examQuestionCount: 30,
    examDurationMinutes: 60,
    passingScorePercent: 50, // Algorithms requires 50% to pass
    isMultilingual: true,
    rawQuestions: algorithmsData.questions,
  },
  {
    id: 'http_js',
    key: 'http_js',
    icon: 'Globe',
    color: 'from-amber-500 to-orange-600',
    totalQuestions: httpJsData.questions.length,
    practiceQuestionCount: 23,
    examQuestionCount: 23,
    examDurationMinutes: 60,
    passingScorePercent: 50, // JS/Networking requires 50% to pass
    isMultilingual: true,
    rawQuestions: httpJsData.questions,
  },
  {
    id: 'sql',
    key: 'sql',
    icon: 'Database',
    color: 'from-emerald-500 to-teal-600',
    totalQuestions: sqlData.questions.length,
    practiceQuestionCount: 30,
    examQuestionCount: 30,
    examDurationMinutes: 60,
    passingScorePercent: 50, // SQL requires 50% to pass
    isMultilingual: true,
    rawQuestions: sqlData.questions,
  },
  {
    id: 'c_theory',
    key: 'c_theory',
    icon: 'Cpu',
    color: 'from-purple-600 to-pink-600',
    totalQuestions: cTheoryData.questions.length,
    practiceQuestionCount: 24,
    examQuestionCount: 24,
    examDurationMinutes: 60,
    passingScorePercent: 50, // C Theory requires 50% to pass
    isMultilingual: true,
    rawQuestions: cTheoryData.questions,
  },
];

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getRandomQuestions(rawQuestions, count = 30) {
  if (!rawQuestions || rawQuestions.length === 0) return [];
  const shuffled = shuffleArray(rawQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function stripLeadingOptionLetter(text) {
  if (typeof text !== 'string') return text || '';
  const stripped = text.replace(/^[A-Da-d][\)\.\:\-]\s+/, '').trim();
  return stripped.length > 0 ? stripped : text;
}

export function normalizeQuestion(q, lang = 'uz', categoryId = '') {
  // If multilingual question (question is an object with uz/ru/en)
  if (q.question && typeof q.question === 'object') {
    const qText = q.question[lang] || q.question.ru || q.question.uz || q.question.en || '';
    const rawOptions = q.options || q.answers || [];

    const options = rawOptions.map((opt, idx) => {
      let rawText = '';
      if (typeof opt.text === 'object' && opt.text) {
        rawText = opt.text[lang] || opt.text.ru || opt.text.uz || opt.text.en || '';
      } else {
        rawText = opt.text || '';
      }

      const optText = stripLeadingOptionLetter(rawText);
      const key = String.fromCharCode(65 + idx);

      return {
        id: opt.id || opt.key || String(idx),
        key,
        text: optText,
        is_correct: !!opt.is_correct,
      };
    });

    const correctAnswers = options.filter(o => o.is_correct).map(o => o.text);

    let explanationText = '';
    if (typeof q.explanation === 'object' && q.explanation) {
      explanationText = q.explanation[lang] || q.explanation.ru || q.explanation.uz || q.explanation.en || '';
    } else if (typeof q.explanation === 'string') {
      explanationText = q.explanation;
    }

    return {
      id: `${categoryId || 'q'}-${q.id}`,
      rawId: q.id,
      categoryId,
      type: q.type || (options.filter(o => o.is_correct).length > 1 ? 'checkbox' : 'radio'),
      question: qText,
      options,
      correctAnswers,
      explanation: explanationText,
      image: q.image || null,
      isCode: !!q.is_code || qText.includes('```') || qText.includes('`') || qText.includes('| --- |'),
    };
  }

  // Standard legacy question with string text
  const options = (q.answers || q.options || []).map((ans, idx) => {
    const rawText = typeof ans.text === 'object' ? (ans.text[lang] || ans.text.ru || '') : ans.text;
    const optText = stripLeadingOptionLetter(rawText);
    const key = String.fromCharCode(65 + idx);
    return {
      id: ans.id || String(idx),
      key,
      text: optText,
      is_correct: !!ans.is_correct,
    };
  });

  return {
    id: `${categoryId || 'q'}-${q.id}`,
    rawId: q.id,
    categoryId,
    type: q.type || (options.filter(o => o.is_correct).length > 1 ? 'checkbox' : 'radio'),
    question: q.question,
    options,
    correctAnswers: q.correct_answers || options.filter(o => o.is_correct).map(o => o.text),
    explanation: q.explanation || '',
    image: q.image || null,
    isCode: q.question.includes('```') || q.question.includes('`') || q.question.includes('| --- |'),
  };
}
