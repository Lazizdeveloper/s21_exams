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
    examQuestionCount: 30,
    examDurationMinutes: 60,
    isMultilingual: true,
    rawQuestions: devopsData.questions,
  },
  {
    id: 'http_js',
    key: 'http_js',
    icon: 'Globe',
    color: 'from-amber-500 to-orange-600',
    totalQuestions: httpJsData.questions.length,
    examQuestionCount: 23,
    examDurationMinutes: 60,
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
    examDurationMinutes: 60,
    isMultilingual: true,
    rawQuestions: sqlData.questions,
  },
  {
    id: 'c_theory',
    key: 'c_theory',
    icon: 'Cpu',
    color: 'from-purple-600 to-pink-600',
    totalQuestions: cTheoryData.questions.length,
    examQuestionCount: 24,
    examDurationMinutes: 60,
    isMultilingual: true,
    rawQuestions: cTheoryData.questions,
  },
];

export function normalizeQuestion(q, lang = 'uz', categoryId = '') {
  // If multilingual question (question is an object with uz/ru/en)
  if (q.question && typeof q.question === 'object') {
    const qText = q.question[lang] || q.question.ru || q.question.uz || q.question.en || '';
    const rawOptions = q.options || q.answers || [];

    const options = rawOptions.map((opt, idx) => {
      let optText = '';
      if (typeof opt.text === 'object' && opt.text) {
        optText = opt.text[lang] || opt.text.ru || opt.text.uz || opt.text.en || '';
      } else {
        optText = opt.text || '';
      }

      const keyMatch = optText.match(/^([A-D])\)/);
      const key = opt.key || (keyMatch ? keyMatch[1] : String.fromCharCode(65 + idx));

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
    const optText = typeof ans.text === 'object' ? (ans.text[lang] || ans.text.ru || '') : ans.text;
    const keyMatch = optText.match(/^([A-D])\)/);
    const key = ans.key || (keyMatch ? keyMatch[1] : String.fromCharCode(65 + idx));
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
