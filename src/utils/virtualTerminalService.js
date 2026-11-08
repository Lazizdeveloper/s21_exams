import { formatCCode, checkCodeStyle } from './clangFormatService';
import { runCppcheck } from './cppcheckService';
import { executeCCode, evaluateWithVerter } from './cRunnerService';

/**
 * Virtual Linux / School 21 Shell Engine
 */
export class VirtualShell {
  constructor({ getCode, setCode, activeTask }) {
    this.getCode = getCode;
    this.setCode = setCode;
    this.activeTask = activeTask;
    this.cwd = '~/src';
    this.history = [];
    this.historyIndex = -1;
    this.hasCompiled = false;
  }

  updateContext({ getCode, setCode, activeTask }) {
    this.getCode = getCode;
    this.setCode = setCode;
    this.activeTask = activeTask;
  }

  async executeCommand(rawCommand) {
    const trimmed = rawCommand.trim();
    if (!trimmed) return [];

    this.history.push(trimmed);
    this.historyIndex = this.history.length;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'clear':
        return [{ type: 'clear' }];

      case 'pwd':
        return [{ type: 'output', text: this.cwd.replace('~', '/home/student') }];

      case 'whoami':
        return [{ type: 'output', text: 'student' }];

      case 'uname':
        return [{ type: 'output', text: 'Linux school21-workstation 6.5.0-s21-generic x86_64 GNU/Linux' }];

      case 'ls': {
        const files = ['main.c', '.clang-format', 'Makefile'];
        if (this.hasCompiled) files.push('a.out');
        const isLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        if (isLong) {
          const lines = [
            'total 16',
            'drwxr-xr-x 2 student student 4096 Nov 8 10:20 .',
            'drwxr-xr-x 4 student student 4096 Nov 8 10:20 ..',
            '-rw-r--r-- 1 student student   42 Nov 8 10:20 .clang-format',
            '-rw-r--r-- 1 student student  350 Nov 8 10:20 Makefile',
            `-rw-r--r-- 1 student student  ${this.getCode().length} Nov 8 10:20 main.c`,
          ];
          if (this.hasCompiled) {
            lines.push('-rwxr-xr-x 1 student student 16420 Nov 8 10:20 a.out');
          }
          return [{ type: 'output', text: lines.join('\n') }];
        }
        return [{ type: 'output', text: files.join('   ') }];
      }

      case 'cd': {
        const target = args[0] || '~';
        if (target === '~' || target === '/home/student' || target === '~/src') {
          this.cwd = '~/src';
        } else if (target === '..') {
          this.cwd = '~';
        } else if (target === '/' || target.startsWith('/')) {
          this.cwd = target;
        } else {
          return [{ type: 'error', text: `bash: cd: ${target}: No such file or directory` }];
        }
        return [];
      }

      case 'cat': {
        const file = args[0];
        if (!file) return [{ type: 'error', text: 'cat: fayl nomi ko\'rsatilmadi' }];
        if (file === 'main.c') {
          return [{ type: 'output', text: this.getCode() }];
        }
        if (file === '.clang-format') {
          return [{ type: 'output', text: '---\nBasedOnStyle: Google\nIndentWidth: 2' }];
        }
        if (file === 'Makefile') {
          return [{ type: 'output', text: 'all: clean main\n\nmain:\n\tgcc -Wall -Werror -Wextra -std=c11 main.c -o a.out\n\nclean:\n\trm -rf a.out *.o' }];
        }
        return [{ type: 'error', text: `cat: ${file}: No such file or directory` }];
      }

      case 'clang-format': {
        const isInPlace = args.includes('-i');
        const isCheckOnly = args.includes('-n');

        if (isInPlace) {
          const currentCode = this.getCode();
          const formatted = await formatCCode(currentCode);
          this.setCode(formatted);
          return [
            { type: 'success', text: 'clang-format: main.c School 21 Google C++ Style bo\'yicha formatlandi (2 probel, to\'g\'ri qavslar).' }
          ];
        }

        if (isCheckOnly || args.length === 0) {
          const res = await checkCodeStyle(this.getCode());
          if (res.ok) {
            return [{ type: 'success', text: res.message }];
          }
          return [{ type: 'error', text: res.message }];
        }

        const formatted = await formatCCode(this.getCode());
        return [{ type: 'output', text: formatted }];
      }

      case 'cppcheck': {
        const res = runCppcheck(this.getCode());
        return [
          { type: res.ok ? 'success' : 'warning', text: res.logs.join('\n') }
        ];
      }

      case 'gcc': {
        const currentCode = this.getCode();
        // Check local syntax errors quickly (e.g. INT vs int)
        if (currentCode.includes('INT ')) {
          return [{
            type: 'error',
            text: `main.c: In function 'main':\nmain.c:4:3: error: unknown type name 'INT'; did you mean 'int'?\n    4 |   INT a, b;\n      |   ^~~\n      |   int\ncompilation terminated due to -Werror.`
          }];
        }

        const execRes = await executeCCode(currentCode, '');
        if (execRes.compileOutput && !execRes.success) {
          this.hasCompiled = false;
          return [{ type: 'error', text: `gcc xatoligi:\n${execRes.compileOutput}` }];
        }

        this.hasCompiled = true;
        return [{
          type: 'success',
          text: 'gcc -Wall -Werror -Wextra -std=c11 main.c -o a.out\nKompilyatsiya muvaffaqiyatli yakunlandi! Bajarish uchun: ./a.out'
        }];
      }

      case './a.out':
      case './main':
      case './main.out': {
        const currentCode = this.getCode();
        if (currentCode.includes('INT ')) {
          return [{
            type: 'error',
            text: `bash: ./a.out: No such file or directory. Avval "gcc -Wall -Werror -Wextra -std=c11 main.c" orqali kompilyatsiya qiling.`
          }];
        }

        const stdinInput = args.join(' ') || this.activeTask?.examples?.[0]?.input || '';
        const execRes = await executeCCode(currentCode, stdinInput);

        if (execRes.compileOutput && !execRes.success) {
          return [{ type: 'error', text: `Kompilyatsiya xatosi:\n${execRes.compileOutput}` }];
        }

        const outputLines = [
          `Kirish (stdin): ${stdinInput || "(bo'sh)"}`,
          `Chiqish (stdout): ${execRes.stdout || "(bo'sh)"}`,
          `[Program exited with code ${execRes.exitCode}]`
        ];
        return [{ type: 'output', text: outputLines.join('\n') }];
      }

      case 'verter':
      case './verter.sh': {
        const res = await evaluateWithVerter(this.getCode(), this.activeTask);
        return [{
          type: res.success ? 'success' : 'warning',
          text: res.logs.join('\n')
        }];
      }

      case 'help':
        return [{
          type: 'output',
          text: `Mavjud School 21 Terminal buyruqlari:
  ls [-la]              - Fayllar ro'yxatini ko'rish
  cat main.c            - Kodni terminalda o'qish
  pwd, whoami, uname    - Tizim ma'lumotlari
  cd [dir]              - Jildni o'zgartirish
  clang-format -i main.c- Kodni Google Style bo'yicha avtomatik formatlash
  clang-format -n main.c- Kod uslubini tekshirish (Style test)
  cppcheck main.c       - Statik kod tahlili (Memory leak, xatolar)
  gcc main.c            - C11 qat'iy bayroqlar bilan kompilyatsiya
  ./a.out [qiymat]      - Dasturni ishga tushirish (masalan: ./a.out 5 10)
  verter                - MiniVERTER to'liq imtihon tekshiruvini ishga tushirish
  clear                 - Terminalni tozalash`
        }];

      default:
        return [{
          type: 'error',
          text: `bash: ${cmd}: command not found. Barcha buyruqlarni ko'rish uchun "help" deb yozing.`
        }];
    }
  }
}
