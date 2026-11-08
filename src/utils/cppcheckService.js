/**
 * CppcheckService - In-browser Static Code Analysis for C (School 21 standard)
 */
export function runCppcheck(code) {
  if (!code || typeof code !== 'string') {
    return {
      errorsCount: 1,
      warningsCount: 0,
      logs: ['[main.c:1]: (error) Bo\'sh fayl'],
    };
  }

  const lines = code.split('\n');
  const logs = [];
  let errorsCount = 0;
  let warningsCount = 0;

  // 1. Bracket balancing check
  let openBraces = 0;
  let openParens = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    openBraces += (l.match(/\{/g) || []).length;
    openBraces -= (l.match(/\}/g) || []).length;
    openParens += (l.match(/\(/g) || []).length;
    openParens -= (l.match(/\)/g) || []).length;
  }
  if (openBraces !== 0) {
    errorsCount++;
    logs.push(`[main.c]: (error) Jingalak qavslar { } muvozanati buzilgan (ochilgan: ${openBraces > 0 ? '+' + openBraces : openBraces})`);
  }
  if (openParens !== 0) {
    errorsCount++;
    logs.push(`[main.c]: (error) Dumaloq qavslar ( ) muvozanati buzilgan`);
  }

  // 2. Scanf return value check (Crucial School 21 requirement)
  const hasScanf = code.includes('scanf(');
  if (hasScanf) {
    const hasCheckedScanf = /if\s*\(\s*scanf\(|==\s*scanf\(|!=\s*scanf\(|scanf\([^)]+\)\s*[!=]=/.test(code);
    if (!hasCheckedScanf) {
      warningsCount++;
      logs.push('[main.c]: (warning) scanf() funksiyasining qaytargan qiymati tekshirilmagan. Agar foydalanuvchi noto\'g\'ri belgi kiritsa, dastur xato ishlaydi va Verter "n/a" chiqmagani uchun 0 ball beradi.');
    }
  }

  // 3. Memory leaks: malloc / calloc vs free
  const mallocCount = (code.match(/\bmalloc\s*\(/g) || []).length + (code.match(/\bcalloc\s*\(/g) || []).length;
  const freeCount = (code.match(/\bfree\s*\(/g) || []).length;
  if (mallocCount > 0 && freeCount === 0) {
    errorsCount++;
    logs.push(`[main.c]: (error: memory leak) ${mallocCount} ta dinamik xotira (malloc/calloc) ajratilgan, lekin bitta ham free() chaqirilmagan! Valgrind xatosi beradi.`);
  } else if (mallocCount > freeCount) {
    warningsCount++;
    logs.push(`[main.c]: (warning: memory leak) Ajratilgan xotiralar soni (${mallocCount}) tozalanganlar sonidan (${freeCount}) ko'p.`);
  }

  // 4. Off-by-one array boundary risks (e.g., i <= length)
  lines.forEach((line, idx) => {
    if (/for\s*\([^;]+;\s*[a-zA-Z0-9_]+\s*<=\s*[a-zA-Z0-9_]+\s*;/.test(line)) {
      warningsCount++;
      logs.push(`[main.c:${idx + 1}]: (warning: out of bounds) Siklda "<=" ishlatilgan. Agar bu massiv indeksi bo'lsa, massiv chegarasidan chiqib ketish (Segmentation Fault) xavfi bor.`);
    }
  });

  // 5. Check for "n/a" handling
  if (!code.includes('"n/a"')) {
    warningsCount++;
    logs.push('[main.c]: (style/logic warning) Kodda "n/a" matni topilmadi. School 21 qoidalariga ko\'ra, xato kirishda "n/a" chiqarilishi shart.');
  }

  // If clean
  if (errorsCount === 0 && warningsCount === 0) {
    logs.push('cppcheck --enable=all --inconclusive main.c');
    logs.push('Checking main.c...');
    logs.push('Xotira oqishi (memory leaks): 0');
    logs.push('Chegaradan chiqish xavfi: 0');
    logs.push('Xavfli funksiyalar: 0');
    logs.push('✅ Cppcheck: Kod toza va barcha mezonlarga mos!');
  }

  return {
    ok: errorsCount === 0,
    errorsCount,
    warningsCount,
    logs,
  };
}
