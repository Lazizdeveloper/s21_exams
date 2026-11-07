import devopsData from './devops.json';
import cTheoryData from './c_theory.json';
import sqlData from './sql.json';
import httpJsData from './http_js.json';

export const CATEGORIES = [
  {
    id: 'devops',
    key: 'devops',
    icon: 'Terminal',
    color: 'from-blue-600 to-indigo-600',
    totalQuestions: devopsData.questions.length,
    examQuestionCount: 40,
    examDurationMinutes: 40,
    isMultilingual: false,
    rawQuestions: devopsData.questions,
  },
  {
    id: 'http_js',
    key: 'http_js',
    icon: 'Globe',
    color: 'from-amber-500 to-orange-600',
    totalQuestions: httpJsData.questions.length,
    examQuestionCount: 23,
    examDurationMinutes: 25,
    isMultilingual: true,
    rawQuestions: httpJsData.questions,
  },
  {
    id: 'sql',
    key: 'sql',
    icon: 'Database',
    color: 'from-emerald-500 to-teal-600',
    totalQuestions: sqlData.questions.length,
    examQuestionCount: 30,
    examDurationMinutes: 30,
    isMultilingual: false,
    rawQuestions: sqlData.questions,
  },
  {
    id: 'c_theory',
    key: 'c_theory',
    icon: 'Cpu',
    color: 'from-purple-600 to-pink-600',
    totalQuestions: cTheoryData.questions.length,
    examQuestionCount: 24,
    examDurationMinutes: 25,
    isMultilingual: false,
    rawQuestions: cTheoryData.questions,
  },
];

export function normalizeQuestion(q, lang = 'uz', categoryId = '') {
  // If multilingual question (http_js)
  if (q.question && typeof q.question === 'object' && ('uz' in q.question || 'ru' in q.question)) {
    const qText = q.question[lang] || q.question.ru || q.question.en || q.question.uz || '';
    const options = (q.options || []).map((opt) => {
      const optText = typeof opt.text === 'object' 
        ? (opt.text[lang] || opt.text.ru || opt.text.en || opt.text.uz || '')
        : opt.text;
      return {
        id: opt.key || String(opt.id),
        key: opt.key || '',
        text: optText,
        is_correct: !!opt.is_correct,
      };
    });

    const correctAnswers = options.filter(o => o.is_correct).map(o => o.text);

    return {
      id: `${categoryId || 'q'}-${q.id}`,
      rawId: q.id,
      categoryId,
      type: 'radio',
      question: qText,
      options,
      correctAnswers,
      explanation: '',
      isCode: !!q.is_code,
    };
  }

  // Standard question (devops, c, sql)
  const options = (q.answers || []).map((ans, idx) => {
    const keyMatch = ans.text.match(/^([A-D])\)/);
    const key = keyMatch ? keyMatch[1] : String.fromCharCode(65 + idx);
    return {
      id: ans.id || String(idx),
      key,
      text: ans.text,
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
