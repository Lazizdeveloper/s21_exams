import { checkCodeStyle } from './clangFormatService';
import { runCppcheck } from './cppcheckService';

/**
 * Execute C Code via Judge0 CE public engine
 */
export async function executeCCode(code, stdin = '') {
  if (!code || !code.trim()) {
    return {
      success: false,
      stdout: '',
      stderr: 'Xatolik: Kod bo\'sh',
      exitCode: -1,
      compileOutput: '',
    };
  }

  try {
    const payload = {
      source_code: code,
      language_id: 50, // C (GCC 9.2.0)
      compiler_options: '-Wall -Werror -Wextra -std=c11',
      stdin: stdin || '',
    };

    const response = await fetch('https://ce.judge0.com/submissions?wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Kompilyator javob bermadi (${response.status})`);
    }

    const data = await response.json();
    const stdout = data.stdout || '';
    const stderr = data.stderr || '';
    const compileOutput = data.compile_output || '';
    const statusDesc = data.status?.description || '';
    const exitCode = data.status?.id === 3 ? 0 : 1;

    return {
      success: exitCode === 0,
      stdout: stdout.trim(),
      stderr: stderr || compileOutput || (exitCode !== 0 ? statusDesc : ''),
      exitCode,
      compileOutput,
      time: data.time || '0.00',
      memory: data.memory || 0,
    };
  } catch (err) {
    // If external API has network issues, provide clear simulated message
    return {
      success: false,
      stdout: '',
      stderr: `Server bilan aloqa xatoligi: ${err.message}. Internet aloqasini tekshiring.`,
      exitCode: -1,
      compileOutput: '',
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

    if (execRes.compileOutput && !execRes.success) {
      logs.push(`  -> Kompilyatsiya xatosi:\n${execRes.compileOutput}`);
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
