# School 21 Exams (Школа 21 Экзамены)

Ushbu repozitoriyda «Школа 21» nazariy imtihonlariga tayyorgarlik savollari va ularning skriptlari jamlangan.

## Mavjud imtihonlar

### 1. DevOps (Теория)
- **Manba**: [widum.ru/s21/devops/](https://widum.ru/s21/devops/)
- **Savollar soni**: 286 ta (radio va checkbox)
- **Fayl**: `devops_exam_questions.json`
- **Skript**: `scrape_devops_questions.py`

### 2. C (Теория)
- **Manba**: [widum.ru/s21/c-theory/](https://widum.ru/s21/c-theory/)
- **Savollar soni**: 24 ta (radio va checkbox)
- **Fayl**: `c_theory_exam_questions.json`
- **Skript**: `scrape_c_theory.py`

Har bir savolda:
- Savol matni (`question`)
- Savol turi (`radio` / `checkbox`)
- Variantlar (`answers`) va ularning to'g'riligi (`is_correct`)
- To'g'ri javoblar ro'yxati (`correct_answers`)
- Savol izohi/tushuntirishi (`explanation`)
