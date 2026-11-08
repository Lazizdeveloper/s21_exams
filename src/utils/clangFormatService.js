import initAsync, { format } from '@wasm-fmt/clang-format/vite';

const GOOGLE_STYLE_CONFIG = JSON.stringify({
  BasedOnStyle: 'Google',
  IndentWidth: 2,
  ColumnLimit: 100,
  AllowShortFunctionsOnASingleLine: 'Inline',
  KeepEmptyLinesAtTheStartOfBlocks: false,
});

let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await initAsync();
    isInitialized = true;
  }
}

/**
 * Format C code using official School 21 Google Style (via WebAssembly)
 */
export async function formatCCode(code) {
  if (!code || typeof code !== 'string') return code;
  try {
    await ensureInitialized();
    const formatted = format(code, 'main.c', GOOGLE_STYLE_CONFIG);
    return formatted;
  } catch (err) {
    console.error('Clang-format error:', err);
    return code;
  }
}

/**
 * Checks if code conforms to Google Style (equivalent to `clang-format -n main.c`)
 */
export async function checkCodeStyle(code) {
  if (!code) return { ok: false, message: 'Kod bo\'sh' };

  try {
    await ensureInitialized();
    const formatted = await formatCCode(code);
    if (formatted.trim() === code.trim()) {
      return {
        ok: true,
        message: 'Style test: OK (1)\nBarcha uslub qoidalari (Google C++ Style)ga to\'liq mos!',
      };
    }

    const originalLines = code.split('\n');
    const formattedLines = formatted.split('\n');
    const issueLines = [];

    const maxLines = Math.max(originalLines.length, formattedLines.length);
    for (let i = 0; i < maxLines; i++) {
      if (originalLines[i] !== formattedLines[i]) {
        issueLines.push(i + 1);
      }
    }

    return {
      ok: false,
      issueLines: issueLines.slice(0, 5),
      message: `Style test: FAIL (0)\n${issueLines.length} ta qatorda uslub buzilishi (probel, tab yoki qavslar) aniqlandi: qatorlar [${issueLines.slice(0, 5).join(', ')}].\n"Clang-Format" tugmasini bosib avtomatik to'g'rilashingiz mumkin.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: `Style test error: ${err.message}`,
    };
  }
}
