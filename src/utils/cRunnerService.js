import { checkCodeStyle } from './clangFormatService.js';
import { runCppcheck } from './cppcheckService.js';

/**
 * UTF-8 xavfsiz Base64 kodlash
 */
function toBase64(str) {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(unescape(encodeURIComponent(str || '')));
  }
  return Buffer.from(str || '', 'utf-8').toString('base64');
}

/**
 * UTF-8 xavfsiz Base64 dekodlash
 */
function fromBase64(str) {
  if (!str) return '';
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(window.atob(str)));
    }
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    try {
      return atob(str);
    } catch {
      return str;
    }
  }
}

/**
 * Execute C Code via Judge0 CE public engine with strict GCC flags
 * Flags: -Wall -Werror -Wextra -std=c11
 */
export async function executeCCode(code, stdin = '') {
  if (!code || !code.trim()) {
    return {
      success: false,
      stdout: '',
      stderr: "Xatolik: Kod bo'sh",
      exitCode: -1,
      compileOutput: "Xatolik: main.c faylida kod mavjud emas.",
    };
  }

  try {
    const payload = {
      source_code: toBase64(code),
      language_id: 50, // C (GCC 9.2.0)
      compiler_options: '-Wall -Werror -Wextra -std=c11',
      stdin: toBase64(stdin || ''),
    };

    const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Kompilyator javob bermadi (${response.status})`);
    }

    const data = await response.json();
    const stdout = fromBase64(data.stdout || '');
    const stderr = fromBase64(data.stderr || '');
    const compileOutput = fromBase64(data.compile_output || '');
    const statusDesc = data.status?.description || '';
    
    // Status ID 3: Accepted (Dastur muvaffaqiyatli kompilyatsiya bo'ldi va ishladi)
    const isSuccess = data.status?.id === 3;
    const exitCode = isSuccess ? 0 : (data.exit_code || 1);

    return {
      success: isSuccess,
      stdout: stdout.trim(),
      stderr: stderr || compileOutput || (!isSuccess ? statusDesc : ''),
      exitCode,
      compileOutput: compileOutput || (data.status?.id === 6 ? statusDesc : ''),
      time: data.time || '0.00',
      memory: data.memory || 0,
    };
  } catch (err) {
    return {
      success: false,
      stdout: '',
      stderr: `Server bilan aloqa xatoligi: ${err.message}. Internet aloqasini tekshiring.`,
      exitCode: -1,
      compileOutput: `Server bilan aloqa xatoligi: ${err.message}. Internet aloqasini tekshiring.`,
    };
  }
}

/**
 * Runs full 4-stage School 21 Verter evaluation against all task test cases
 */
export async function evaluateWithVerter(code, activeTask) {
  const logs = [];
  logs.push('MiniVERTER is watching your code... ¯\\_(*_*)_/¯');
  logs.push('-------------------------------------------------------------------------------');

  // Stage 1: Style Test (clang-format -n)
  logs.push('[1/4] Style test (Google C++ Style via clang-format)...');
  const styleRes = await checkCodeStyle(code);
  if (!styleRes.ok) {
    logs.push(styleRes.message);
    logs.push('❌ VERTER RESULT: FAIL (0%) — Kod uslubi Google Style talabiga javob bermaydi.');
    return {
      success: false,
      score: 0,
      stage: 'style',
      logs,
    };
  }
  logs.push('  -> Style test: OK (1)');

  // Stage 2: Cppcheck (Static analysis)
  logs.push('[2/4] Cppcheck static code analysis...');
  const cppcheckRes = runCppcheck(code);
  if (cppcheckRes.errorsCount > 0) {
    cppcheckRes.logs.forEach(l => logs.push(`  -> ${l}`));
    logs.push('❌ VERTER RESULT: FAIL (0%) — Xotira sizib chiqishi yoki kritik sintaktik xato aniqlandi.');
    return {
      success: false,
      score: 0,
      stage: 'cppcheck',
      logs,
    };
  }
  logs.push('  -> Cppcheck: OK (1) — Memory leaks: 0');

  // Stage 3 & 4: Build & Test Cases execution
  logs.push('[3/4] Build test (gcc -Wall -Werror -Wextra -std=c11)...');
  logs.push('[4/4] Functional test cases verification...');

  const examples = activeTask.examples || [];
  if (examples.length === 0) {
    logs.push('  -> Sinov uchun namunalar mavjud emas. Kod tekshirildi: OK');
    logs.push('🎉 VERTER RESULT: SUCCESS (100%)');
    return { success: true, score: 100, stage: 'done', logs };
  }

  let passedCount = 0;
  for (let i = 0; i < examples.length; i++) {
    const ex = examples[i];
    const execRes = await executeCCode(code, ex.input);

    if (!execRes.success && (execRes.compileOutput || execRes.stderr)) {
      const err = execRes.compileOutput || execRes.stderr;
      logs.push(`  -> Kompilyatsiya xatosi:\n${err}`);
      logs.push('❌ VERTER RESULT: FAIL (0%) — Kompilyatsiya amalga oshmadi.');
      return { success: false, score: 0, stage: 'build', logs };
    }

    const expected = (ex.output || '').trim();
    const actual = (execRes.stdout || '').trim();

    if (actual === expected) {
      passedCount++;
      logs.push(`  -> Test #${i + 1} (Kirish: "${ex.input || ''}"): PASSED [stdout: "${actual}"]`);
    } else {
      logs.push(`  -> Test #${i + 1} FAILED!`);
      logs.push(`     Kutilgan: "${expected}"`);
      logs.push(`     Olingan:  "${actual}"`);
    }
  }

  const score = Math.round((passedCount / examples.length) * 100);
  logs.push('-------------------------------------------------------------------------------');
  if (score === 100) {
    logs.push(`🎉 VERTER RESULT: SUCCESS (100% Passed) — Barcha testlar muvaffaqiyatli topshirildi!`);
    return { success: true, score: 100, stage: 'done', logs };
  } else {
    logs.push(`⚠️ VERTER RESULT: PARTIAL / FAIL (${score}%) — ${passedCount}/${examples.length} ta test o'tdi.`);
    return { success: false, score, stage: 'tests', logs };
  }
}
