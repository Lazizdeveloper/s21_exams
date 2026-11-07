import json

# Full accurate translations for C Theory (24 questions)
# Following rule: Technical terms (Unix, SSH, Git, GitLab, malloc, free, calloc, realloc,
# argc, argv, struct, pointer, strdup, strcmp, goto, linker, preprocessor, compiler, etc.)
# are kept in standard English technical form.

c_translations = [
  {
    "id": 752,
    "question": {
      "ru": "Основные компоненты Unix?",
      "uz": "Unix tizimining asosiy komponentlari qaysilar?",
      "en": "What are the core components of Unix?"
    },
    "answers": [
      {
        "id": "2467",
        "text": {
          "ru": "A) Системные библиотеки",
          "uz": "A) System kutubxonalari (libraries)",
          "en": "A) System libraries"
        },
        "is_correct": True
      },
      {
        "id": "2470",
        "text": {
          "ru": "B) Графическая оболочка",
          "uz": "B) Grafik qobiq (GUI)",
          "en": "B) Graphical shell (GUI)"
        },
        "is_correct": False
      },
      {
        "id": "2469",
        "text": {
          "ru": "C) Системные утилиты",
          "uz": "C) System utilitalari (utilities)",
          "en": "C) System utilities"
        },
        "is_correct": True
      },
      {
        "id": "2468",
        "text": {
          "ru": "D) Ядро",
          "uz": "D) Kernel (Yadro)",
          "en": "D) Kernel"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Unix состоит из ядра, системных библиотек, утилит и интерфейсов, но не обязательно включает графическую оболочку.",
      "uz": "Unix kernel, system kutubxonalari, utilitalar va interfeyslardan iborat, biroq grafik qobiq (GUI) bo'lishi majburiy emas.",
      "en": "Unix consists of the kernel, system libraries, utilities, and interfaces, but does not strictly require a graphical shell."
    }
  },
  {
    "id": 753,
    "question": {
      "ru": "Какое имя файла является валидным?",
      "uz": "Unix tizimida qanday fayl nomi valid (to'g'ri) hisoblanadi?",
      "en": "Which file name is considered valid in Unix?"
    },
    "answers": [
      {
        "id": "2473",
        "text": {
          "ru": "A) Имя должно быть не длиннее 8 символов",
          "uz": "A) Fayl nomi 8 ta belgidan uzun bo'lmasligi kerak",
          "en": "A) The name must not exceed 8 characters"
        },
        "is_correct": False
      },
      {
        "id": "2471",
        "text": {
          "ru": "B) Любая последовательность букв и цифр",
          "uz": "B) Harflar va raqamlarning har qanday ketma-ketligi",
          "en": "B) Any sequence of letters and numbers"
        },
        "is_correct": False
      },
      {
        "id": "2472",
        "text": {
          "ru": "C) Любая последовательность букв, цифр и спец. символов",
          "uz": "C) Harflar, raqamlar va maxsus belgilarning har qanday ketma-ketligi",
          "en": "C) Any sequence of letters, numbers, and special characters"
        },
        "is_correct": False
      },
      {
        "id": "2474",
        "text": {
          "ru": "D) Любая последовательность символов, кроме «/» и «\\0»",
          "uz": "D) «/» va «\\0» (null byte) dan tashqari har qanday belgilar ketma-ketligi",
          "en": "D) Any sequence of characters except '/' and '\\0' (null byte)"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "В Unix имя файла может содержать любые символы, кроме «/» (разделителя директорий) и нулевого байта «\\0».",
      "uz": "Unix tizimida fayl nomi «/» (directory ajratuvchisi) va «\\0» (null byte) dan tashqari barcha belgilardan iborat bo'lishi mumkin.",
      "en": "In Unix, a filename can contain any characters except '/' (directory separator) and the null byte '\\0'."
    }
  },
  {
    "id": 754,
    "question": {
      "ru": "Что такое SSH и где применяется?",
      "uz": "SSH nima va u qayerda qo'llaniladi?",
      "en": "What is SSH and where is it used?"
    },
    "answers": [
      {
        "id": "2476",
        "text": {
          "ru": "A) SSH применяется для безопасной передачи данных",
          "uz": "A) SSH faqat ma'lumotlarni xavfsiz uzatish uchun qo'llaniladi",
          "en": "A) SSH is used only for secure data transfer"
        },
        "is_correct": False
      },
      {
        "id": "2475",
        "text": {
          "ru": "B) SSH применяется для передачи гипертекста",
          "uz": "B) SSH gipermatn (hypertext) uzatish uchun ishlatiladi",
          "en": "B) SSH is used for transmitting hypertext"
        },
        "is_correct": False
      },
      {
        "id": "2478",
        "text": {
          "ru": "C) SSH – это протокол канального уровня",
          "uz": "C) SSH — bu data link darajasidagi protokol",
          "en": "C) SSH is a data link layer protocol"
        },
        "is_correct": False
      },
      {
        "id": "2477",
        "text": {
          "ru": "D) SSH (secure shell) – это сетевой протокол для защищенного управления удалёнными системами",
          "uz": "D) SSH (secure shell) — masofadagi tizimlarni xavfsiz boshqarish uchun mo'ljallangan network protokoli",
          "en": "D) SSH (secure shell) is a network protocol for securely managing remote systems"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "SSH — это прикладной протокол, предназначенный для безопасного управления удалёнными машинами и передачи данных.",
      "uz": "SSH — masofadagi serverlarni xavfsiz boshqarish va ma'lumot uzatish uchun mo'ljallangan amaliy darajadagi protokol.",
      "en": "SSH is an application-layer protocol designed for secure remote server administration and data transfer."
    }
  },
  {
    "id": 755,
    "question": {
      "ru": "В чем разница между git и GitLab?",
      "uz": "Git va GitLab o'rtasidagi farq nimada?",
      "en": "What is the difference between Git and GitLab?"
    },
    "answers": [
      {
        "id": "2480",
        "text": {
          "ru": "A) Git – это веб-интерфейс, а GitLab – язык программирования",
          "uz": "A) Git — veb-interfeys, GitLab esa dasturlash tili",
          "en": "A) Git is a web interface, while GitLab is a programming language"
        },
        "is_correct": False
      },
      {
        "id": "2482",
        "text": {
          "ru": "B) Git и GitLab — одно и то же",
          "uz": "B) Git va GitLab — bir xil narsa",
          "en": "B) Git and GitLab are the same thing"
        },
        "is_correct": False
      },
      {
        "id": "2481",
        "text": {
          "ru": "C) GitLab – это клиент для Git",
          "uz": "C) GitLab — bu Git uchun mijoz dasturi (client)",
          "en": "C) GitLab is a client for Git"
        },
        "is_correct": False
      },
      {
        "id": "2479",
        "text": {
          "ru": "D) Git – это система управления версиями, а GitLab – это веб сервис для размещения репозиториев",
          "uz": "D) Git — versiyalarni boshqarish tizimi (VCS), GitLab esa repository joylashtirish uchun veb-servis",
          "en": "D) Git is a version control system, while GitLab is a web service for hosting repositories"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Git — это система контроля версий, а GitLab — платформа для хранения и управления репозиториями с интерфейсом и CI/CD.",
      "uz": "Git — versiyalar nazorati tizimi, GitLab esa repository saqlash, boshqarish va CI/CD platformasi.",
      "en": "Git is a version control system, whereas GitLab is a web platform for repository hosting, management, and CI/CD."
    }
  },
  {
    "id": 756,
    "question": {
      "ru": "Как хранятся строки в памяти в С?",
      "uz": "C tilida stringlar (satrlar) xotirada qanday saqlanadi?",
      "en": "How are strings stored in memory in C?"
    },
    "answers": [
      {
        "id": "2483",
        "text": {
          "ru": "A) Хранятся как массив с последним символом «\\0»",
          "uz": "A) Oxirgi belgisi «\\0» (null-terminator) bo'lgan massiv (array) sifatida",
          "en": "A) Stored as an array terminated with a '\\0' (null character)"
        },
        "is_correct": True
      },
      {
        "id": "2484",
        "text": {
          "ru": "B) Хранятся в виде объекта",
          "uz": "B) Obyekt (object) ko'rinishida",
          "en": "B) Stored as an object"
        },
        "is_correct": False
      },
      {
        "id": "2485",
        "text": {
          "ru": "C) Хранятся в бинарном дереве",
          "uz": "C) Binary tree ko'rinishida",
          "en": "C) Stored in a binary tree"
        },
        "is_correct": False
      },
      {
        "id": "2486",
        "text": {
          "ru": "D) Хранятся как структура данных",
          "uz": "D) Alohida ma'lumotlar strukturasi sifatida",
          "en": "D) Stored as a data structure"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Строки в C — это массивы символов, оканчивающиеся специальным символом null — «\\0».",
      "uz": "C tilida stringlar null («\\0») belgisi bilan tugallanuvchi char massivlaridir.",
      "en": "Strings in C are arrays of characters terminated by a null character ('\\0')."
    }
  },
  {
    "id": 757,
    "question": {
      "ru": "Что такое строки в языке С?",
      "uz": "C dasturlash tilida stringlar nima?",
      "en": "What are strings in the C programming language?"
    },
    "answers": [
      {
        "id": "2487",
        "text": {
          "ru": "A) Строка — это объект",
          "uz": "A) Satr — bu obyekt (object)",
          "en": "A) A string is an object"
        },
        "is_correct": False
      },
      {
        "id": "2488",
        "text": {
          "ru": "B) Строка — это массив символов",
          "uz": "B) Satr — bu char massivi (array of characters)",
          "en": "B) A string is an array of characters"
        },
        "is_correct": True
      },
      {
        "id": "2489",
        "text": {
          "ru": "C) Можно получить доступ к отдельным символам",
          "uz": "C) Har bir alohida belgiga index orqali kirish mumkin",
          "en": "C) Individual characters can be accessed by index"
        },
        "is_correct": True
      },
      {
        "id": "2490",
        "text": {
          "ru": "D) Источник ошибок, так как нет защиты при выходе за границы",
          "uz": "D) Chegaradan chiqishda (buffer overflow) himoyasi yo'q",
          "en": "D) A source of bugs because there is no bounds checking"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Строка в C — это массив символов, к каждому из которых можно обратиться по индексу. Нет встроенной защиты от выхода за границы.",
      "uz": "C tilida satr belgilar massividir va har bir belgiga indeks orqali murojaat qilish mumkin.",
      "en": "In C, a string is a character array where each character can be accessed via an index."
    }
  },
  {
    "id": 758,
    "question": {
      "ru": "Как происходит обработка ошибок в С и нужно ли проверять выделение памяти?",
      "uz": "C tilida error handling qanday amalga oshiriladi va memory allocation tekshirilishi kerakmi?",
      "en": "How is error handling done in C and is checking memory allocation necessary?"
    },
    "answers": [
      {
        "id": "2492",
        "text": {
          "ru": "A) Malloc не всегда выделяет память",
          "uz": "A) malloc doim ham memory ajrata olmasligi mumkin",
          "en": "A) malloc may fail to allocate memory"
        },
        "is_correct": True
      },
      {
        "id": "2491",
        "text": {
          "ru": "B) Нужно проверять результат malloc",
          "uz": "B) malloc natijasini tekshirish (NULL ga) shart",
          "en": "B) Checking the result of malloc (for NULL) is required"
        },
        "is_correct": True
      },
      {
        "id": "2494",
        "text": {
          "ru": "C) Ошибки обрабатываются автоматически",
          "uz": "C) Xatolar avtomatik tarzda qayta ishlanadi",
          "en": "C) Errors are handled automatically"
        },
        "is_correct": False
      },
      {
        "id": "2493",
        "text": {
          "ru": "D) В C нет встроенной поддержки исключений",
          "uz": "D) C tilida o'rnatilgan exception handling mexanizmi mavjud emas",
          "en": "D) C has no built-in exception handling mechanism"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "В C нет исключений, поэтому нужно вручную проверять успешность выделения памяти через malloc и аналогичные функции.",
      "uz": "C tilida exceptionlar yo'q, shuning uchun malloc va shunga o'xshash funksiyalar natijasi doimo qo'lda tekshirilishi shart.",
      "en": "C lacks exceptions, so the return value of malloc and related functions must always be manually checked against NULL."
    }
  },
  {
    "id": 759,
    "question": {
      "ru": "Какие существуют функции для работы с памятью?",
      "uz": "C tilida dynamic memory bilan ishlash uchun qaysi funksiyalar mavjud?",
      "en": "Which functions are used for dynamic memory management in C?"
    },
    "answers": [
      {
        "id": "2498",
        "text": {
          "ru": "A) free",
          "uz": "A) free",
          "en": "A) free"
        },
        "is_correct": True
      },
      {
        "id": "2495",
        "text": {
          "ru": "B) malloc",
          "uz": "B) malloc",
          "en": "B) malloc"
        },
        "is_correct": True
      },
      {
        "id": "2496",
        "text": {
          "ru": "C) calloc",
          "uz": "C) calloc",
          "en": "C) calloc"
        },
        "is_correct": True
      },
      {
        "id": "2497",
        "text": {
          "ru": "D) realloc",
          "uz": "D) realloc",
          "en": "D) realloc"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "malloc, calloc, realloc — выделяют память, free — освобождает. Это стандартные функции работы с памятью в C.",
      "uz": "malloc, calloc, realloc — memory ajratadi, free esa xotirani bo'shatadi.",
      "en": "malloc, calloc, and realloc allocate memory, while free deallocates it."
    }
  },
  {
    "id": 760,
    "question": {
      "ru": "Какие аргументы у main()?",
      "uz": "C tilida main() funksiyasining to'g'ri argumentlari qaysilar?",
      "en": "What are the valid arguments for main() in C?"
    },
    "answers": [
      {
        "id": "2501",
        "text": {
          "ru": "A) int n, char c",
          "uz": "A) int n, char c",
          "en": "A) int n, char c"
        },
        "is_correct": False
      },
      {
        "id": "2502",
        "text": {
          "ru": "B) void *argv",
          "uz": "B) void *argv",
          "en": "B) void *argv"
        },
        "is_correct": False
      },
      {
        "id": "2500",
        "text": {
          "ru": "C) int argc, char *argv[]",
          "uz": "C) int argc, char *argv[]",
          "en": "C) int argc, char *argv[]"
        },
        "is_correct": True
      },
      {
        "id": "2499",
        "text": {
          "ru": "D) int argc, char **argv",
          "uz": "D) int argc, char **argv",
          "en": "D) int argc, char **argv"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Стандартные сигнатуры: int main(void) или int main(int argc, char *argv[]) (эквивалентно char **argv).",
      "uz": "Standart main signature: int main(void) yoki int main(int argc, char *argv[]) (bu char **argv ga teng).",
      "en": "Standard signatures are int main(void) or int main(int argc, char *argv[]) (equivalent to char **argv)."
    }
  },
  {
    "id": 761,
    "question": {
      "ru": "Как происходит обработка аргументов командной строки?",
      "uz": "C tilida command line argumentlari (CLI arguments) qanday qayta ishlanadi?",
      "en": "How are command-line arguments handled in C?"
    },
    "answers": [
      {
        "id": "2505",
        "text": {
          "ru": "A) Обрабатывается компилятором автоматически",
          "uz": "A) Compiler tomonidan avtomatik qayta ishlanadi",
          "en": "A) Handled automatically by the compiler"
        },
        "is_correct": False
      },
      {
        "id": "2506",
        "text": {
          "ru": "B) Передаются через глобальные переменные",
          "uz": "B) Global o'zgaruvchilar orqali uzatiladi",
          "en": "B) Passed via global variables"
        },
        "is_correct": False
      },
      {
        "id": "2503",
        "text": {
          "ru": "C) Обрабатывается программистом с использованием argc и argv",
          "uz": "C) Dasturchi tomonidan argc va argv argumentlaridan foydalanib",
          "en": "C) Handled by the programmer using argc and argv"
        },
        "is_correct": True
      },
      {
        "id": "2504",
        "text": {
          "ru": "D) Доступны через отдельную библиотеку arguments.h",
          "uz": "D) arguments.h alohida kutubxonasi orqali olinadi",
          "en": "D) Accessible via a separate arguments.h library"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "argc хранит количество переданных аргументов, argv — массив строк аргументов командной строки.",
      "uz": "argc argumentlar sonini saqlaydi, argv esa command line argumentlarining string massividir.",
      "en": "argc holds the count of arguments, and argv is an array of strings representing command-line arguments."
    }
  },
  {
    "id": 762,
    "question": {
      "ru": "Каким режимом открыть файл для до записи в конец?",
      "uz": "Faylning oxiriga ma'lumot qo'shish (append) uchun fayl qaysi rejimda ochiladi?",
      "en": "Which mode is used to open a file for appending data to the end?"
    },
    "answers": [
      {
        "id": "2508",
        "text": {
          "ru": "A) w",
          "uz": "A) w",
          "en": "A) w"
        },
        "is_correct": False
      },
      {
        "id": "2507",
        "text": {
          "ru": "B) r",
          "uz": "B) r",
          "en": "B) r"
        },
        "is_correct": False
      },
      {
        "id": "2509",
        "text": {
          "ru": "C) a",
          "uz": "C) a",
          "en": "C) a"
        },
        "is_correct": True
      },
      {
        "id": "2510",
        "text": {
          "ru": "D) r+",
          "uz": "D) r+",
          "en": "D) r+"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Режим 'a' (append) открывает файл для добавления данных в конец, создавая его при отсутствии.",
      "uz": "'a' (append) rejimi fayl oxiriga yozish uchun ochadi va fayl mavjud bo'lmasa uni yaratadi.",
      "en": "The 'a' (append) mode opens a file for appending data at the end, creating it if it does not exist."
    }
  },
  {
    "id": 763,
    "question": {
      "ru": "Как вернуть код ошибки и значение функции?",
      "uz": "C tilida funksiyadan error code va asosiy qiymatni bir vaqtning o'zida qanday qaytarish mumkin?",
      "en": "How can a function in C return both an error code and a computed value?"
    },
    "answers": [
      {
        "id": "2513",
        "text": {
          "ru": "A) Нельзя, функция может возвращать только одно значение",
          "uz": "A) Mumkin emas, funksiya faqat bitta qiymat qaytara oladi",
          "en": "A) Not possible, a function can only return a single value"
        },
        "is_correct": False
      },
      {
        "id": "2514",
        "text": {
          "ru": "B) Возврат двух значений через запятую: return a, b",
          "uz": "B) Vergul orqali ikkita qiymat qaytarish: return a, b",
          "en": "B) Returning two comma-separated values: return a, b"
        },
        "is_correct": False
      },
      {
        "id": "2512",
        "text": {
          "ru": "C) Через глобальные переменные",
          "uz": "C) Global o'zgaruvchilar orqali",
          "en": "C) Via global variables"
        },
        "is_correct": False
      },
      {
        "id": "2511",
        "text": {
          "ru": "D) Возврат кода ошибки, значение — через указатель",
          "uz": "D) Funksiya return orqali error code qaytaradi, qiymat esa pointer (ko'rsatkich) orqali uzatiladi",
          "en": "D) Return error code via return value, and output computed value via pointer"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Идиоматичный подход в C: вернуть статус/код ошибки через return (например, 0 или -1), а результат записать по указателю.",
      "uz": "C tilidagi standart yondashuv: return orqali status/error code qaytariladi, natija esa pointer orqali argumentga yoziladi.",
      "en": "Idiomatic C approach: return an error code via return value, and pass the result out through a pointer argument."
    }
  },
  {
    "id": 764,
    "question": {
      "ru": "Какие типы файлов существуют?",
      "uz": "Unix/C tizimlarida qanday fayl turlari mavjud?",
      "en": "What types of files exist in Unix/C systems?"
    },
    "answers": [
      {
        "id": "2517",
        "text": {
          "ru": "A) Блочные",
          "uz": "A) Block device fayllari",
          "en": "A) Block device files"
        },
        "is_correct": True
      },
      {
        "id": "2518",
        "text": {
          "ru": "B) Только текстовые",
          "uz": "B) Faqat matnli (text)",
          "en": "B) Text files only"
        },
        "is_correct": False
      },
      {
        "id": "2515",
        "text": {
          "ru": "C) Бинарные",
          "uz": "C) Binary (ikkilik) fayllar",
          "en": "C) Binary files"
        },
        "is_correct": True
      },
      {
        "id": "2516",
        "text": {
          "ru": "D) Текстовые",
          "uz": "D) Text fayllar",
          "en": "D) Text files"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Файлы бывают регулярные (текстовые, бинарные), а также специальные: блочные, символьные, сокеты, пайпы и т.д.",
      "uz": "Fayllar regular (text, binary) va maxsus (block, character, socket, pipe) turlarga bo'linadi.",
      "en": "Files include regular (text, binary) and special files: block devices, character devices, sockets, pipes, etc."
    }
  },
  {
    "id": 765,
    "question": {
      "ru": "Укажите верные утверждения о структурах в С?",
      "uz": "C tilidagi struct (strukturalar) haqida qaysi fikrlar to'g'ri?",
      "en": "Which statements about structs in C are correct?"
    },
    "answers": [
      {
        "id": "2522",
        "text": {
          "ru": "A) Можно менять тип переменных",
          "uz": "A) Turli xil ma'lumot turlaridagi o'zgaruvchilarni birlashtiradi",
          "en": "A) Groups variables of different data types"
        },
        "is_correct": True
      },
      {
        "id": "2520",
        "text": {
          "ru": "B) Не могут содержать указатели",
          "uz": "B) Pointerlarni o'z ichiga ololmaydi",
          "en": "B) Cannot contain pointers"
        },
        "is_correct": False
      },
      {
        "id": "2521",
        "text": {
          "ru": "C) Память для struct выделяется только динамически",
          "uz": "C) struct uchun xotira faqat dynamic ajratiladi",
          "en": "C) Memory for struct is allocated dynamically only"
        },
        "is_correct": False
      },
      {
        "id": "2519",
        "text": {
          "ru": "D) Для struct можно выделять как статически, так и динамически память",
          "uz": "D) struct uchun ham static (stack), ham dynamic (heap) memory ajratish mumkin",
          "en": "D) Memory for structs can be allocated both statically and dynamically"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Структуры объединяют поля разных типов. Память под них можно выделять на стеке (статически) или в куче через malloc.",
      "uz": "Strukturalar turli tipdagi maydonlarni birlashtiradi va ular uchun xotira stack yoki heap (malloc) orqali ajratilishi mumkin.",
      "en": "Structs aggregate fields of different types. They can be allocated on the stack or on the heap via malloc."
    }
  },
  {
    "id": 766,
    "question": {
      "ru": "Какие операции можно проводить над структурами?",
      "uz": "C tilida struct (strukturalar) ustida qanday amallarni bajarish mumkin?",
      "en": "Which operations can be performed on structs in C?"
    },
    "answers": [
      {
        "id": "2526",
        "text": {
          "ru": "A) Сравнение через ==",
          "uz": "A) == orqali to'g'ridan-to'g'ri taqqoslash",
          "en": "A) Direct comparison using =="
        },
        "is_correct": False
      },
      {
        "id": "2524",
        "text": {
          "ru": "B) Можно обращаться с помощью операций . и ->",
          "uz": "B) . va -> operatorlari orqali maydonlarga murojaat qilish",
          "en": "B) Member access using . and -> operators"
        },
        "is_correct": True
      },
      {
        "id": "2525",
        "text": {
          "ru": "C) Сложение структур оператором +",
          "uz": "C) + operatori bilan strukturalarni qo'shish",
          "en": "C) Adding structs using the + operator"
        },
        "is_correct": False
      },
      {
        "id": "2523",
        "text": {
          "ru": "D) Можно копировать структуры присваиванием",
          "uz": "D) = (assignment) operatori orqali strukturalarni nusxalash",
          "en": "D) Copying structs via assignment (=)"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "К полям обращаются через . или ->. Структуры можно копировать через =, но операторы == и + не поддерживаются.",
      "uz": "Maydonlarga . yoki -> orqali kiriladi. Strukturalarni = orqali to'g'ridan-to'g'ri nusxalash mumkin, lekin == va + amallari C da mavjud emas.",
      "en": "Members are accessed via . or ->. Structs can be assigned (=) directly, but == and + are not supported in C."
    }
  },
  {
    "id": 767,
    "question": {
      "ru": "Какие существуют способы представления матрицы в памяти?",
      "uz": "C tilida matrix (matritsa)ni xotirada ifodalashning qaysi usullari mavjud?",
      "en": "Which methods exist for representing a matrix in memory in C?"
    },
    "answers": [
      {
        "id": "2529",
        "text": {
          "ru": "A) Массив указателей на столбцы",
          "uz": "A) Ustunlarga pointerlar massivi",
          "en": "A) Array of pointers to columns"
        },
        "is_correct": True
      },
      {
        "id": "2527",
        "text": {
          "ru": "B) Двумерный массив",
          "uz": "B) Ikki o'lchovli statik massiv (2D array)",
          "en": "B) Two-dimensional array"
        },
        "is_correct": True
      },
      {
        "id": "2530",
        "text": {
          "ru": "C) Связанный список",
          "uz": "C) Linked list",
          "en": "C) Linked list"
        },
        "is_correct": False
      },
      {
        "id": "2528",
        "text": {
          "ru": "D) Массив указателей на строки",
          "uz": "D) Qatorlarga pointerlar massivi (int **matrix)",
          "en": "D) Array of pointers to rows (e.g. int **)"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Матрицу можно представить через массив массивов (двумерный), или массив указателей на строки/столбцы. Связанный список не используется для матриц.",
      "uz": "Matritsa 2D massiv yoki qatorlarga/ustunlarga yo'naltirilgan pointerlar massivi orqali ifodalanadi.",
      "en": "A matrix can be represented as a 2D contiguous array or an array of pointers to rows/columns."
    }
  },
  {
    "id": 768,
    "question": {
      "ru": "Какая функция позволяет скопировать строку с выделением памяти под новую строку?",
      "uz": "Yangi satr uchun avtomatik memory ajratgan holda satrni nusxalovchi funksiya qaysi?",
      "en": "Which function copies a string while automatically allocating memory for the duplicate?"
    },
    "answers": [
      {
        "id": "2532",
        "text": {
          "ru": "A) strdup",
          "uz": "A) strdup",
          "en": "A) strdup"
        },
        "is_correct": True
      },
      {
        "id": "2534",
        "text": {
          "ru": "B) strcpy",
          "uz": "B) strcpy",
          "en": "B) strcpy"
        },
        "is_correct": False
      },
      {
        "id": "2533",
        "text": {
          "ru": "C) memcpy",
          "uz": "C) memcpy",
          "en": "C) memcpy"
        },
        "is_correct": False
      },
      {
        "id": "2531",
        "text": {
          "ru": "D) strconcat",
          "uz": "D) strconcat",
          "en": "D) strconcat"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Функция strdup копирует строку в новую область памяти и автоматически выделяет память.",
      "uz": "strdup funksiyasi satrni yangi memory manziliga nusxalaydi va malloc orqali xotira ajratadi.",
      "en": "The strdup function allocates memory via malloc and duplicates the string into it."
    }
  },
  {
    "id": 769,
    "question": {
      "ru": "Что вернет strcmp(«adcb», «abc»)?",
      "uz": "strcmp(\"adcb\", \"abc\") funksiyasi chaqirilsa, natija nima bo'ladi?",
      "en": "What does strcmp(\"adcb\", \"abc\") return?"
    },
    "answers": [
      {
        "id": "2538",
        "text": {
          "ru": "A) 1",
          "uz": "A) 1",
          "en": "A) 1"
        },
        "is_correct": False
      },
      {
        "id": "2536",
        "text": {
          "ru": "B) 0",
          "uz": "B) 0",
          "en": "B) 0"
        },
        "is_correct": False
      },
      {
        "id": "2537",
        "text": {
          "ru": "C) -1",
          "uz": "C) -1",
          "en": "C) -1"
        },
        "is_correct": False
      },
      {
        "id": "2535",
        "text": {
          "ru": "D) Положительное число",
          "uz": "D) Musbat son (> 0)",
          "en": "D) A positive number (> 0)"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Функция strcmp возвращает положительное значение, если первая строка лексикографически больше ('d' > 'b').",
      "uz": "Ikkinchi belgilar taqqoslanganda 'd' belgisi 'b' dan katta (ASCII qiymati bo'yicha), shuning uchun strcmp musbat son qaytaradi.",
      "en": "strcmp returns a positive value because at the first differing character, 'd' has a greater ASCII value than 'b'."
    }
  },
  {
    "id": 770,
    "question": {
      "ru": "Что такое структурное программирование?",
      "uz": "Structured programming (tuzilmaviy dasturlash) nima?",
      "en": "What is structured programming?"
    },
    "answers": [
      {
        "id": "2541",
        "text": {
          "ru": "A) В нем используются классы",
          "uz": "A) Unda classlar ishlatiladi",
          "en": "A) It relies on classes"
        },
        "is_correct": False
      },
      {
        "id": "2539",
        "text": {
          "ru": "B) В нем используются функции",
          "uz": "B) Unda funksiyalar (subroutines) ishlatiladi",
          "en": "B) It uses functions/subroutines"
        },
        "is_correct": True
      },
      {
        "id": "2542",
        "text": {
          "ru": "C) В нем используются структуры",
          "uz": "C) Unda faqat strukturalar ishlatiladi",
          "en": "C) It uses structs only"
        },
        "is_correct": False
      },
      {
        "id": "2540",
        "text": {
          "ru": "D) В нем используется декомпозиция и 3 базовые конструкции",
          "uz": "D) Unda dekompozitsiya va 3 ta asosiy boshqaruv konstruksiyasi (ketma-ketlik, tarmoqlanish, tsikl) ishlatiladi",
          "en": "D) It uses decomposition and 3 control structures: sequence, selection, and iteration"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Структурное программирование использует декомпозицию, функции и конструкции: последовательность, ветвление, цикл.",
      "uz": "Tuzilmaviy dasturlash kodni funksiyalarga bo'lish (dekompozitsiya) hamda ketma-ketlik, shart (if/else) va tsikllar orqali tashkil etishga asoslanadi.",
      "en": "Structured programming relies on code decomposition, functions, and three control structures: sequence, selection, and iteration."
    }
  },
  {
    "id": 771,
    "question": {
      "ru": "Что не является принципом структурного программирования?",
      "uz": "Structured programming prinsiplariga nimalar kirmaydi (zid hisoblanadi)?",
      "en": "Which of the following is NOT a principle of structured programming?"
    },
    "answers": [
      {
        "id": "2544",
        "text": {
          "ru": "A) Использование goto",
          "uz": "A) goto operatoridan foydalanish",
          "en": "A) Using the goto statement"
        },
        "is_correct": True
      },
      {
        "id": "2546",
        "text": {
          "ru": "B) Использование функций",
          "uz": "B) Funksiyalardan foydalanish",
          "en": "B) Using functions"
        },
        "is_correct": False
      },
      {
        "id": "2543",
        "text": {
          "ru": "C) Использование глобальных переменных",
          "uz": "C) Global o'zgaruvchilardan (global variables) foydalanish",
          "en": "C) Using global variables"
        },
        "is_correct": True
      },
      {
        "id": "2545",
        "text": {
          "ru": "D) Использование циклов",
          "uz": "D) Tsikllardan foydalanish",
          "en": "D) Using loops"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Структурное программирование избегает goto и глобальных переменных, поощряя модульность и читаемость.",
      "uz": "Tuzilmaviy dasturlash goto va global o'zgaruvchilardan saqlanishni, kodni modulli va tushunarli qilishni talab qiladi.",
      "en": "Structured programming discourages goto and excessive global variables, promoting modular and readable code."
    }
  },
  {
    "id": 772,
    "question": {
      "ru": "Что является принципом структурного программирования?",
      "uz": "Structured programming ning asosiy prinsipi nima?",
      "en": "What is a core principle of structured programming?"
    },
    "answers": [
      {
        "id": "2549",
        "text": {
          "ru": "A) Следует использовать только глобальные переменные",
          "uz": "A) Faqat global o'zgaruvchilardan foydalanish kerak",
          "en": "A) Only global variables should be used"
        },
        "is_correct": False
      },
      {
        "id": "2550",
        "text": {
          "ru": "B) Рекомендуется использовать классы",
          "uz": "B) Classlardan foydalanish tavsiya etiladi",
          "en": "B) Classes are recommended"
        },
        "is_correct": False
      },
      {
        "id": "2548",
        "text": {
          "ru": "C) Все должно быть написано в одной функции",
          "uz": "C) Hamma narsa bitta funksiya ichida yozilishi kerak",
          "en": "C) Everything must be written inside a single function"
        },
        "is_correct": False
      },
      {
        "id": "2547",
        "text": {
          "ru": "D) Программа должна быть разбита на отдельные блоки или функции",
          "uz": "D) Dastur alohida bloklar yoki funksiyalarga bo'lingan (dekompozitsiya qilingan) bo'lishi kerak",
          "en": "D) The program should be decomposed into separate blocks or functions"
        },
        "is_correct": True
      }
    ],
    "explanation": {
      "ru": "Ключевая идея структурного программирования — декомпозиция кода на функции и блоки.",
      "uz": "Tuzilmaviy dasturlashning asosiy g'oyasi — murakkab dasturni mustaqil kichik bloklar va funksiyalarga ajratishdir.",
      "en": "The foundational idea of structured programming is code decomposition into modular functions and blocks."
    }
  },
  {
    "id": 773,
    "question": {
      "ru": "Что такое компиляция?",
      "uz": "Kompilyatsiya (Compilation) nima?",
      "en": "What is compilation?"
    },
    "answers": [
      {
        "id": "2553",
        "text": {
          "ru": "A) Запуск программы на выполнение",
          "uz": "A) Dasturni ishga tushirish (execution)",
          "en": "A) Executing the program"
        },
        "is_correct": False
      },
      {
        "id": "2552",
        "text": {
          "ru": "B) Проверка стиля и форматирования кода",
          "uz": "B) Kodning formatlash va uslubini tekshirish",
          "en": "B) Checking code formatting and style"
        },
        "is_correct": False
      },
      {
        "id": "2551",
        "text": {
          "ru": "C) Процесс преобразования исходного кода в исполняемый файл",
          "uz": "C) Source kodni mashina kodi / binary executable faylga aylantirish jarayoni",
          "en": "C) The process of transforming source code into an executable file"
        },
        "is_correct": True
      },
      {
        "id": "2554",
        "text": {
          "ru": "D) Сжатие исходного кода",
          "uz": "D) Source kodni siqish (compress)",
          "en": "D) Compressing the source code"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Компиляция — это преобразование исходного кода в машинный код, понятный процессору.",
      "uz": "Kompilyatsiya — dasturchi yozgan source kodni protsessor tushunadigan machine code ga aylantirishdir.",
      "en": "Compilation is the transformation of high-level source code into machine code for the processor."
    }
  },
  {
    "id": 774,
    "question": {
      "ru": "Что такое препроцессор в С?",
      "uz": "C tilida Preprocessor nima?",
      "en": "What is the preprocessor in C?"
    },
    "answers": [
      {
        "id": "2555",
        "text": {
          "ru": "A) Выполняет замену макросов и вставку текстов перед компиляцией",
          "uz": "A) Kompilyatsiyadan oldin makroslarni almashtirish va fayllarni include qilishni bajaradi",
          "en": "A) Performs macro expansion, conditional compilation, and header inclusion prior to compilation"
        },
        "is_correct": True
      },
      {
        "id": "2557",
        "text": {
          "ru": "B) Преобразует код в машинные инструкции",
          "uz": "B) Kodni to'g'ridan-to'g'ri machine instructionlarga aylantiradi",
          "en": "B) Translates code into machine instructions"
        },
        "is_correct": False
      },
      {
        "id": "2558",
        "text": {
          "ru": "C) Оптимизирует бинарный файл",
          "uz": "C) Binary faylni optimallashtiradi",
          "en": "C) Optimizes the binary file"
        },
        "is_correct": False
      },
      {
        "id": "2556",
        "text": {
          "ru": "D) Запускает программу",
          "uz": "D) Dasturni ishga tushiradi",
          "en": "D) Runs the program"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Препроцессор обрабатывает директивы вида #include, #define и подготавливает код к компиляции.",
      "uz": "Preprocessor #include, #define kabi direktivalarga ishlov beradi va kodni bevosita kompilyatsiyaga tayyorlaydi.",
      "en": "The preprocessor processes directives such as #include and #define before actual code compilation."
    }
  },
  {
    "id": 775,
    "question": {
      "ru": "Что такое компоновщик?",
      "uz": "Linker (komponovshik) nima?",
      "en": "What is a linker?"
    },
    "answers": [
      {
        "id": "2561",
        "text": {
          "ru": "A) Проверяет грамматику языка",
          "uz": "A) Dasturlash tili grammatikasini tekshiradi",
          "en": "A) Checks the syntax/grammar of the language"
        },
        "is_correct": False
      },
      {
        "id": "2559",
        "text": {
          "ru": "B) Соединяет объектные файлы в единый исполняемый файл",
          "uz": "B) Object fayllar (.o/.obj) va kutubxonalarni bitta executable faylga birlashtiradi",
          "en": "B) Combines object files and libraries into a single executable file"
        },
        "is_correct": True
      },
      {
        "id": "2562",
        "text": {
          "ru": "C) Удаляет ненужные части программы",
          "uz": "C) Dasturning keraksiz qismlarini o'chiradi",
          "en": "C) Deletes unused parts of the program"
        },
        "is_correct": False
      },
      {
        "id": "2560",
        "text": {
          "ru": "D) Переименовывает переменные",
          "uz": "D) O'zgaruvchilar nomini o'zgartiradi",
          "en": "D) Renames variables"
        },
        "is_correct": False
      }
    ],
    "explanation": {
      "ru": "Компоновщик (linker) объединяет все объектные файлы и библиотеки в итоговый исполняемый файл.",
      "uz": "Linker barcha object fayllar va bog'langan kutubxonalarni yagona ishga tushuvchi (.exe / ELF) faylga yig'adi.",
      "en": "The linker binds all compiled object files and external libraries into the final executable."
    }
  }
]

# Write to both devops/c_theory_exam_questions.json and devops/src/data/c_theory.json
for out_path in ["/home/laziz/devops/c_theory_exam_questions.json", "/home/laziz/devops/src/data/c_theory.json"]:
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "source": "https://widum.ru/s21/c-theory/",
            "title": "Школа 21. Экзамен С (теория)",
            "total_questions": len(c_translations),
            "questions": c_translations
        }, f, ensure_ascii=False, indent=2)
    print(f"Updated {out_path} with 24 multilingual questions.")
