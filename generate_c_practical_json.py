import os
import json
import re

TASKS = [
    # Ex_01
    {
        "id": "ex_01_01",
        "exerciseGroup": "Ex_01",
        "level": 1,
        "title": {
            "uz": "Exam 01.01: Xatolarni tuzatish №1 (Ko'paytirish)",
            "ru": "Exam 01.01: Исправление ошибок №1 (Умножение)",
            "en": "Exam 01.01: Fixing errors #1 (Multiplication)"
        },
        "topics": {
            "uz": "Boshlang'ich ma'lumot turlari, o'zgaruvchilarni e'lon qilish, o'zlashtirish",
            "ru": "Базовые типы данных, объявление переменных, оператор присваивания",
            "en": "Basic data types, variable declaration, assignment operator"
        },
        "description": {
            "uz": "Dastur yozishda sintaktik xatolarga yo'l qo'yilgan. Dasturning ishlash mantig'ini o'zgartirmasdan sintaktik, uslubiy va mantiqiy xatolarni to'g'irlang. Kiritish xato bo'lsa 'n/a' chiqishi kerak. Javob oxirida yangi qatorga o'tish (\n) bo'lmasligi lozim.",
            "ru": "При написании программы была допущена ошибка. Необходимо исправить синтаксические, стилевые и логические ошибки, не изменяя работу программы. В случае любой ошибки выводить 'n/a'. В конце ответа не должно быть переноса на новую строку.",
            "en": "An error occurred when writing the program. Correct syntactic, stylistic, and logical errors without changing program logic. In case of error output 'n/a'. There should be no newline break at the end of the response."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    INT a, b;\n    a = b = 1;\n\n    scanf(\"%d %d\", &a, &b);\n    printf(\"%d\", a * b);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_01/Ex_01_01.c",
        "examples": [
            {"input": "2 2", "output": "4"},
            {"input": "-4 4", "output": "-16"}
        ]
    },
    {
        "id": "ex_01_02",
        "exerciseGroup": "Ex_01",
        "level": 1,
        "title": {
            "uz": "Exam 01.02: Xatolarni tuzatish №2 (Vergul xatosi)",
            "ru": "Exam 01.02: Исправление ошибок №2",
            "en": "Exam 01.02: Fixing errors #2"
        },
        "topics": {
            "uz": "O'zgaruvchilar va kiritish/chiqarish",
            "ru": "Переменные и ввод/вывод",
            "en": "Variables and input/output"
        },
        "description": {
            "uz": "Dasturdagi o'zgaruvchini e'lon qilishdagi sintaktik xatoni to'g'irlang va kiritilgan sonlar ko'paytmasini chiqaring. Xato kiritilsa 'n/a' chiqarilsin.",
            "ru": "Исправьте синтаксические ошибки объявления переменных. Выведите произведение чисел. При ошибке выводите 'n/a'.",
            "en": "Correct syntactic errors in variable declaration and output product. Output 'n/a' on error."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int x1 = 1 x2 = 2;\n\n    scanf(\"%d %d\", &x1, &x2);\n    printf(\"%d\", x1 * x2);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_01/Ex_01_02.c",
        "examples": [
            {"input": "2 2", "output": "4"},
            {"input": "-4 4", "output": "-16"}
        ]
    },
    {
        "id": "ex_01_03",
        "exerciseGroup": "Ex_01",
        "level": 1,
        "title": {
            "uz": "Exam 01.03: Xatolarni tuzatish №3 (Sintaksis)",
            "ru": "Exam 01.03: Исправление ошибок №3",
            "en": "Exam 01.03: Fixing errors #3"
        },
        "topics": {
            "uz": "Ma'lumot turlari sintaksisi",
            "ru": "Синтаксис типов данных",
            "en": "Data type syntax"
        },
        "description": {
            "uz": "O'zgaruvchi e'lon qilishdagi noto'g'ri 'int:' belgisini tuzating va ko'paytmani chop eting.",
            "ru": "Исправьте некорректное двоеточие в объявлении типов и выведите произведение.",
            "en": "Fix colon typo in type declaration and output multiplication result."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int: first = 3, second = 4;\n\n    scanf(\"%d %d\", &first, &second);\n    printf(\"%d\", first * second);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_01/Ex_01_03.c",
        "examples": [
            {"input": "2 2", "output": "4"},
            {"input": "-4 4", "output": "-16"}
        ]
    },
    {
        "id": "ex_01_04",
        "exerciseGroup": "Ex_01",
        "level": 1,
        "title": {
            "uz": "Exam 01.04: Xatolarni tuzatish №4 (Takroriy tur)",
            "ru": "Exam 01.04: Исправление ошибок №4",
            "en": "Exam 01.04: Fixing errors #4"
        },
        "topics": {
            "uz": "O'zgaruvchilarni e'lon qilish",
            "ru": "Объявление переменных",
            "en": "Variable declaration"
        },
        "description": {
            "uz": "Bir qatorda takroriy 'int' yozilishini to'g'irlang va sonlar ko'paytmasini chiqaring.",
            "ru": "Исправьте повторное указание типа 'int' в одной строке и выведите произведение.",
            "en": "Fix duplicate 'int' keyword in single line declaration and output product."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int left = 2, int right = 1;\n\n    scanf(\"%d %d\", &left, &right);\n    printf(\"%d\", left * right);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_01/Ex_01_04.c",
        "examples": [
            {"input": "2 2", "output": "4"},
            {"input": "-4 4", "output": "-16"}
        ]
    },
    {
        "id": "ex_01_05",
        "exerciseGroup": "Ex_01",
        "level": 1,
        "title": {
            "uz": "Exam 01.05: Xatolarni tuzatish №5 (O'zgaruvchi turi)",
            "ru": "Exam 01.05: Исправление ошибок №5",
            "en": "Exam 01.05: Fixing errors #5"
        },
        "topics": {
            "uz": "Haqiqiy sonlar (double/float)",
            "ru": "Вещественные числа",
            "en": "Floating point types"
        },
        "description": {
            "uz": "E'lon qilinmagan 'pi' o'zgaruvchisiga to'g'ri tur bering va ko'paytmani nuqtadan keyin 2 xona aniqlikda (%.2f) chiqaring.",
            "ru": "Объявите тип переменной 'pi' и выведите произведение с точностью до двух знаков (%.2f).",
            "en": "Declare variable 'pi' properly and output product rounded to 2 decimal places (%.2f)."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int x = 0; pi = 3.141;\n\n    scanf(\"%d\", &x);\n    printf(\"%.2f\", pi * x);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_01/Ex_01_05.c",
        "examples": [
            {"input": "0", "output": "0.00"},
            {"input": "2", "output": "6.28"}
        ]
    },
    {
        "id": "ex_01_06",
        "exerciseGroup": "Ex_01",
        "level": 1,
        "title": {
            "uz": "Exam 01.06: Xatolarni tuzatish №6 (Satr xatosi)",
            "ru": "Exam 01.06: Исправление ошибок №6",
            "en": "Exam 01.06: Fixing errors #6"
        },
        "topics": {
            "uz": "Sonli literallar va turlar",
            "ru": "Числовые литералы и типы",
            "en": "Numeric literals"
        },
        "description": {
            "uz": "Qo'shtirnoq ichida yozilgan \"3.141\" satrini sonli songa o'zgartiring va ko'paytmani %.2f formatida chiqaring.",
            "ru": "Исправьте строковый литерал \"3.141\" на вещественное число и выведите результат в формате %.2f.",
            "en": "Fix string literal \"3.141\" to floating number and print with %.2f precision."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int value = 1;\n    double pi = \"3.141\";\n\n    scanf(\"%d\", &value);\n    printf(\"%.2f\", value * pi);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_01/Ex_01_06.c",
        "examples": [
            {"input": "0", "output": "0.00"},
            {"input": "2", "output": "6.28"}
        ]
    },

    # Ex_02
    {
        "id": "ex_02_01",
        "exerciseGroup": "Ex_02",
        "level": 1,
        "title": {
            "uz": "Exam 02.01: Formatlab chiqarish №1 (00000)",
            "ru": "Exam 02.01: Некорректная работа программы №1",
            "en": "Exam 02.01: Formatted output #1 (5 digits)"
        },
        "topics": {
            "uz": "Ma'lumotlarni kiritish/chiqarish formatlari (printf)",
            "ru": "Ввод/вывод данных (printf)",
            "en": "Data input/output formatting"
        },
        "description": {
            "uz": "Butun son kiritiladi. Uni 5 ta belgidan iborat qilib, bo'sh joylarni nollar bilan to'ldirgan holda chiqaring (masalan: 1 -> 00001, -10 -> -0010).",
            "ru": "Считайте целое число и выведите его в формате пяти знаков с ведущими нулями (1 -> 00001, -10 -> -0010).",
            "en": "Read an integer and print with 5 digits padded with leading zeros (1 -> 00001, -10 -> -0010)."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int x = 0;\n\n    scanf(\"%d\", x);\n    printf(\"%05d\", x);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_02/Ex_02_01.c",
        "examples": [
            {"input": "0", "output": "00000"},
            {"input": "1", "output": "00001"},
            {"input": "-10", "output": "-0010"},
            {"input": "666666", "output": "666666"}
        ]
    },
    {
        "id": "ex_02_02",
        "exerciseGroup": "Ex_02",
        "level": 1,
        "title": {
            "uz": "Exam 02.02: Formatlab chiqarish №2",
            "ru": "Exam 02.02: Некорректная работа программы №2",
            "en": "Exam 02.02: Formatted output #2"
        },
        "topics": {
            "uz": "printf va scanf xatolarini tuzatish",
            "ru": "Исправление ошибок printf и scanf",
            "en": "Fixing printf and scanf errors"
        },
        "description": {
            "uz": "Dasturdagi scanf pointer xatosini (&x) va %03d formatini %05d ga to'g'irlab, 5 xonali nol bilan to'ldirilgan sonni chiqaring.",
            "ru": "Исправьте ошибку взятия адреса &x в scanf и формат вывода на %05d.",
            "en": "Fix missing address operator &x in scanf and format output with %05d."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int x = -21;\n\n    scanf(\"%d\", x);\n    printf(\"%03d\", x);\n\n    return 0;\n}",
        "c_file": "21-Exam/Ex_02/Ex_02_02.c",
        "examples": [
            {"input": "0", "output": "00000"},
            {"input": "1", "output": "00001"},
            {"input": "-12", "output": "-0012"},
            {"input": "55555", "output": "55555"}
        ]
    },
    {
        "id": "ex_02_03",
        "exerciseGroup": "Ex_02",
        "level": 1,
        "title": {
            "uz": "Exam 02.03: Men Grutman! (\"I'm Groot\")",
            "ru": "Exam 02.03: Я есть Грут!",
            "en": "Exam 02.03: I'm Groot"
        },
        "topics": {
            "uz": "Satrli literallarni chiqarish, qo'shtirnoqlarni escape qilish",
            "ru": "Вывод строковых литералов, экранирование",
            "en": "String literal output, escaping quotes"
        },
        "description": {
            "uz": "Standart chiqish oqimiga mashhur '\"I'm Groot\" (c) Groot' iborasini chop etuvchi dastur yozing. Oxirida yangi qator (\n) bo'lmasligi shart.",
            "ru": "Написать программу для вывода знаменитой фразы: '\"I'm Groot\" (c) Groot'. В конце ответа не должно быть переноса строки.",
            "en": "Write a program that outputs the quote: '\"I'm Groot\" (c) Groot'. No newline at the end."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_02/Ex_02_03.c",
        "examples": [
            {"input": "(bo'sh)", "output": "\"I'm Groot\" (c) Groot"}
        ]
    },
    {
        "id": "ex_02_04",
        "exerciseGroup": "Ex_02",
        "level": 1,
        "title": {
            "uz": "Exam 02.04: Bloknotga yo'l (Notepad Path)",
            "ru": "Exam 02.04: Путь к Блокноту",
            "en": "Exam 02.04: Path to Notepad"
        },
        "topics": {
            "uz": "Teskari slesh (\\) belgisini escape qilish",
            "ru": "Экранирование обратного слеша",
            "en": "Backslash escaping"
        },
        "description": {
            "uz": "Windows Bloknot dasturining to'liq yo'lini chop eting: 'C:\\Windows\\System32\\notepad.exe'. Oxirida \n bo'lmasin.",
            "ru": "Выведите полный путь к блокноту: 'C:\\Windows\\System32\\notepad.exe'. В конце ответа не должно быть переноса строки.",
            "en": "Output the complete path to Notepad: 'C:\\Windows\\System32\\notepad.exe'. No newline at the end."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_02/Ex_02_04.c",
        "examples": [
            {"input": "(bo'sh)", "output": "C:\\Windows\\System32\\notepad.exe"}
        ]
    },
    {
        "id": "ex_02_05",
        "exerciseGroup": "Ex_02",
        "level": 1,
        "title": {
            "uz": "Exam 02.05: 205 sonini chiqarish",
            "ru": "Exam 02.05: Вывод числа 205",
            "en": "Exam 02.05: Output number 205"
        },
        "topics": {
            "uz": "printf va o'zgaruvchilarni chiqarish",
            "ru": "Вывод переменных через printf",
            "en": "Printing variables"
        },
        "description": {
            "uz": "Dasturdagi xatoni tuzatib, ekranga 205 sonini chiqaring.",
            "ru": "Исправьте ошибку в коде и выведите число 205.",
            "en": "Fix bug and output number 205."
        },
        "originalCode": "#include <stdio.h>\n\nint main(void)\n{\n    int x = 205;\n    printf(\"%d\", &x);\n    return 0;\n}",
        "c_file": "21-Exam/Ex_02/Ex_02_05.c",
        "examples": [
            {"input": "(bo'sh)", "output": "205"}
        ]
    },

    # Ex_03
    {
        "id": "ex_03_01",
        "exerciseGroup": "Ex_03",
        "level": 2,
        "title": {
            "uz": "Exam 03.01: Platina shari massasi",
            "ru": "Exam 03.01: Масса платинового шара",
            "en": "Exam 03.01: Mass of platinum sphere"
        },
        "topics": {
            "uz": "Matematik formulalar (math.h), round, double",
            "ru": "Математические функции, round, double",
            "en": "Math formulas, round, double"
        },
        "description": {
            "uz": "Platina shari radiusi R beriladi. Uning massasini kg larda hisoblang (zichlik = 21500 kg/m^3, hajm V = (4/3)*pi*R^3). Natijani eng yaqin butun songa yaxlitlang (round). Xato kiritilsa 'n/a' chiqsin.",
            "ru": "Задан радиус шара из платины R. Вычислить массу шара (плотность 21500, V = (4/3)*pi*R^3). Округлить до целого (round). При ошибке выводить 'n/a'.",
            "en": "Given sphere radius R in meters, compute platinum sphere mass (density 21500, V = 4/3*pi*R^3). Round to nearest integer. Output 'n/a' on error."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_03/Ex_03_01.c",
        "examples": [
            {"input": "1", "output": "90059"},
            {"input": "10", "output": "90058989"}
        ]
    },
    {
        "id": "ex_03_02",
        "exerciseGroup": "Ex_03",
        "level": 2,
        "title": {
            "uz": "Exam 03.02: Radiandan gradusga o'tkazish",
            "ru": "Exam 03.02: Перевод в градусную меру",
            "en": "Exam 03.02: Radian to degrees conversion"
        },
        "topics": {
            "uz": "Arifmetik amallar, round yaxlitlash",
            "ru": "Арифметические действия, округление round",
            "en": "Arithmetic, round function"
        },
        "description": {
            "uz": "Radianda berilgan qiymatni gradusga o'tkazing (1 rad = 57.29 gradus). Natijani butun songa yaxlitlang. Xato kiritilsa 'n/a' chiqsin.",
            "ru": "Перевести величину из радиан в градусы (1 радиан = 57.29 градусов). Округлить до целого числа. При ошибке выводить 'n/a'.",
            "en": "Convert radians to degrees (1 rad = 57.29 deg). Round to integer. Output 'n/a' on error."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_03/Ex_03_02.c",
        "examples": [
            {"input": "1", "output": "57"},
            {"input": "2", "output": "115"}
        ]
    },
    {
        "id": "ex_03_03",
        "exerciseGroup": "Ex_03",
        "level": 4,
        "title": {
            "uz": "Exam 03.03: 3 xonali son chetki raqamlarini almashtirish",
            "ru": "Exam 03.03: Перестановка цифр",
            "en": "Exam 03.03: Swap first and last digits"
        },
        "topics": {
            "uz": "Raqamlar bilan ishlash, bo'lish va qoldiq (%)",
            "ru": "Операции с цифрами числа, % и /",
            "en": "Digit manipulation, modulo and division"
        },
        "description": {
            "uz": "3 xonali butun son beriladi. Uning birinchi va oxirgi raqamlarini o'rnini almashtiring. Nollar saqlanishi kerak (masalan: 120 -> 021, -123 -> -321).",
            "ru": "Переставьте крайние цифры трехзначного числа. Учитывать ведущие нули (120 -> 021, -123 -> -321).",
            "en": "Swap first and last digits of a 3-digit integer, preserving leading zeros (120 -> 021, -123 -> -321)."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_03/Ex_03_03.c",
        "examples": [
            {"input": "159", "output": "951"},
            {"input": "120", "output": "021"},
            {"input": "-123", "output": "-321"}
        ]
    },
    {
        "id": "ex_03_04",
        "exerciseGroup": "Ex_03",
        "level": 3,
        "title": {
            "uz": "Exam 03.04: Oraliqqa tushish (Inside the interval)",
            "ru": "Exam 03.04: Вхождение в интервал",
            "en": "Exam 03.04: Inside the interval"
        },
        "topics": {
            "uz": "Mantiqiy ifodalar (if ishlatmasdan hisoblash)",
            "ru": "Логические выражения без if",
            "en": "Boolean expressions without if"
        },
        "description": {
            "uz": "Uchta A, B, C soni beriladi. Agar C soni A va B orasida qat'iy yotsa (min(A,B) < C < max(A,B)), 1 chiqaring, aks holda 0. Diqqat: 'if' faqat xatolikni tekshirish uchun ruxsat etiladi!",
            "ru": "Заданы A, B, C. Вывести 1, если C строго между A и B, иначе 0. Условие if разрешено только для проверки ошибок ввода!",
            "en": "Three integers A, B, C. Output 1 if C is strictly between A and B, otherwise 0. 'if' only allowed for error handling!"
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_03/Ex_03_04.c",
        "examples": [
            {"input": "0 9 4", "output": "1"},
            {"input": "0 1 4", "output": "0"},
            {"input": "0 0 0", "output": "0"}
        ]
    },
    {
        "id": "ex_03_05",
        "exerciseGroup": "Ex_03",
        "level": 2,
        "title": {
            "uz": "Exam 03.05: Mantiqiy ifoda (x and (z or y))",
            "ru": "Exam 03.05: Логическое выражение",
            "en": "Exam 03.05: Logical expression"
        },
        "topics": {
            "uz": "Bul algebrasi, mantiqiy amallar",
            "ru": "Булева логика, логические операции",
            "en": "Boolean algebra, logical operators"
        },
        "description": {
            "uz": "x, y, z (faqat 0 yoki 1) sonlari beriladi. 'x and (z or y)' ifodasi rost bo'lsa 1, aks holda 0 chiqaring. Xatolikda 'n/a'.",
            "ru": "Даны x, y, z (0 или 1). Вывести 1, если выражение 'x and (z or y)' истинно, иначе 0. При ошибке 'n/a'.",
            "en": "Input x, y, z (0 or 1). Output 1 if 'x and (z or y)' is true, else 0. On error 'n/a'."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_03/Ex_03_05.c",
        "examples": [
            {"input": "1 1 1", "output": "1"},
            {"input": "0 0 0", "output": "0"}
        ]
    },

    # Ex_04
    {
        "id": "ex_04_01",
        "exerciseGroup": "Ex_04",
        "level": 3,
        "title": {
            "uz": "Exam 04.01: Binomial koeffitsiyentlar",
            "ru": "Exam 04.01: Биномиальные коэффициенты",
            "en": "Exam 04.01: Binomial coefficients"
        },
        "topics": {
            "uz": "Sikllar, funksiyalar, faktorial hisoblash",
            "ru": "Циклы, функции, факториал",
            "en": "Loops, functions, factorial"
        },
        "description": {
            "uz": "Manfiy bo'lmagan butun n soni kiritiladi. Paskal uchburchagining n-qatori binomial koeffitsiyentlarini bo'shliq bilan ajratib chiqaring (C_n^k = n! / (k! * (n-k)!)). Oxirgi sondan keyin bo'shliq bo'lmasin.",
            "ru": "Вывести строку биномиальных коэффициентов C(n, k) для k от 0 до n через пробел. После последнего числа пробела быть не должно.",
            "en": "Print binomial coefficients C(n, k) for k=0..n separated by space. No trailing space."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_04/Ex_04_01.c",
        "examples": [
            {"input": "0", "output": "1"},
            {"input": "1", "output": "1 1"},
            {"input": "2", "output": "1 2 1"},
            {"input": "3", "output": "1 3 3 1"}
        ]
    },
    {
        "id": "ex_04_02",
        "exerciseGroup": "Ex_04",
        "level": 2,
        "title": {
            "uz": "Exam 04.02: Ketma-ketlikdan eng kattasini topish",
            "ru": "Exam 04.02: Поиск наибольшего",
            "en": "Exam 04.02: Find maximum in sequence"
        },
        "topics": {
            "uz": "Sikllar, shartlar, -1 belgisi bilan to'xtash",
            "ru": "Циклы, условие окончания -1",
            "en": "Loops, sentinel value -1"
        },
        "description": {
            "uz": "Manfiy bo'lmagan butun sonlar ketma-ketligi beriladi. Ketma-ketlik -1 bilan tugaydi. Ular orasidan eng katta sonni topib chiqaring.",
            "ru": "Найти наибольшее число в последовательности неотрицательных чисел, оканчивающейся на -1.",
            "en": "Find the maximum number in a sequence of non-negative integers terminated by -1."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_04/Ex_04_02.c",
        "examples": [
            {"input": "1000 -1", "output": "1000"},
            {"input": "1 2 3 4 3 2 1 -1", "output": "4"}
        ]
    },
    {
        "id": "ex_04_04",
        "exerciseGroup": "Ex_04",
        "level": 3,
        "title": {
            "uz": "Exam 04.04: Sonning eng katta raqami",
            "ru": "Exam 04.04: Наибольшая цифра",
            "en": "Exam 04.04: Largest digit in number"
        },
        "topics": {
            "uz": "Raqamlarni ajratish, sikl va shart",
            "ru": "Выделение цифр числа, циклы",
            "en": "Extracting digits, loops"
        },
        "description": {
            "uz": "Butun son kiritiladi. Uning raqamlari orasidan eng kattasini topib ekranga chiqaring. Xato kiritilsa 'n/a'.",
            "ru": "Вывести наибольшую цифру заданного целого числа. При ошибке выводить 'n/a'.",
            "en": "Output the largest digit of an integer. On error output 'n/a'."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_04/Ex_04_04.c",
        "examples": [
            {"input": "123", "output": "3"},
            {"input": "18", "output": "8"},
            {"input": "111111", "output": "1"},
            {"input": "0", "output": "0"}
        ]
    },
    {
        "id": "ex_04_05",
        "exerciseGroup": "Ex_04",
        "level": 3,
        "title": {
            "uz": "Exam 04.05: Toq raqamlar ko'paytmasi",
            "ru": "Exam 04.05: Произведение нечетных цифр",
            "en": "Exam 04.05: Product of odd digits"
        },
        "topics": {
            "uz": "Son raqamlarini tahlil qilish, toq sonlar",
            "ru": "Анализ цифр числа, нечетные цифры",
            "en": "Digit analysis, odd numbers"
        },
        "description": {
            "uz": "Butun son kiritiladi. Uning barcha toq raqamlari ko'paytmasini chiqaring. Agar toq raqamlar umuman bo'lmasa, 0 chiqaring.",
            "ru": "Вывести произведение нечетных цифр числа. Если нечетных цифр нет, вывести 0.",
            "en": "Print the product of odd digits of an integer. If no odd digits exist, print 0."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_04/Ex_04_05.c",
        "examples": [
            {"input": "1234", "output": "3"},
            {"input": "24", "output": "0"},
            {"input": "-3", "output": "3"}
        ]
    },

    # Ex_05
    {
        "id": "ex_05_01",
        "exerciseGroup": "Ex_05",
        "level": 3,
        "title": {
            "uz": "Exam 05.01: Vektorlarning skalyar ko'paytmasi",
            "ru": "Exam 05.01: Скалярное произведение",
            "en": "Exam 05.01: Dot product of vectors"
        },
        "topics": {
            "uz": "Dinamik massivlar, malloc/free, vektorlar",
            "ru": "Динамические массивы, malloc/free, скалярное произведение",
            "en": "Dynamic arrays, malloc/free, dot product"
        },
        "description": {
            "uz": "n o'lchamli ikkita vektor koordinatalari beriladi. Ularning skalyar ko'paytmasini (sum a[i]*b[i]) hisoblang. Xotirani tozalash (free) shart. Xatolikda 'n/a'.",
            "ru": "Вычислить скалярное произведение двух n-мерных векторов. Обязательно освободить память. При ошибке 'n/a'.",
            "en": "Calculate the dot product of two n-dimensional vectors. Free dynamic memory. Output 'n/a' on error."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_05/05_01.c",
        "examples": [
            {"input": "1\n7\n3", "output": "21"},
            {"input": "3\n1 2 3\n1 2 3", "output": "14"}
        ]
    },
    {
        "id": "ex_05_03",
        "exerciseGroup": "Ex_05",
        "level": 3,
        "title": {
            "uz": "Exam 05.03: Ketma-ketlikni chetlaridan chiqarish",
            "ru": "Exam 05.03: Вывод последовательности (X1, Xn, X2...)",
            "en": "Exam 05.03: Interleaved sequence output"
        },
        "topics": {
            "uz": "Dinamik massivlar, ko'rsatkichlar bilan manipulyatsiya",
            "ru": "Динамические массивы, перестановка элементов",
            "en": "Dynamic arrays, index manipulation"
        },
        "description": {
            "uz": "Manfiy bo'lmagan butun sonlar ketma-ketligi (-1 bilan tugaydi) beriladi. Ularni X_1, X_n, X_2, X_{n-1}, ... tartibida bo'shliq bilan ajratib chiqaring.",
            "ru": "Вывести элементы последовательности (завершается -1) в порядке: X_1, X_n, X_2, X_{n-1}, ... через пробел.",
            "en": "Print elements of sequence terminated by -1 in order: X_1, X_n, X_2, X_{n-1}, ... separated by space."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_05/05_03.c",
        "examples": [
            {"input": "1 2 3 -1", "output": "1 3 2"},
            {"input": "1 2 3 4 5 6 -1", "output": "1 6 2 5 3 4"}
        ]
    },
    {
        "id": "ex_05_04",
        "exerciseGroup": "Ex_05",
        "level": 3,
        "title": {
            "uz": "Exam 05.04: Takroriy elementlarni o'chirish",
            "ru": "Exam 05.04: Удаление повторений",
            "en": "Exam 05.04: Remove duplicates"
        },
        "topics": {
            "uz": "Massivda qidirish, noyob elementlar",
            "ru": "Поиск в массиве, уникальные элементы",
            "en": "Array searching, unique elements"
        },
        "description": {
            "uz": "Ketma-ketlikdan takrorlanuvchi elementlarni olib tashlang. Elementlarning birinchi uchrash tartibi saqlansin (-1 bilan tugaydi).",
            "ru": "Удалить повторяющиеся элементы последовательности (завершается -1), сохраняя исходный порядок первых вхождений.",
            "en": "Remove duplicate elements in sequence (-1 terminated), preserving original order of first occurrences."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_05/05_04.c",
        "examples": [
            {"input": "1 1 2 2 3 -1", "output": "1 2 3"},
            {"input": "1 2 1 3 1 4 -1", "output": "1 2 3 4"}
        ]
    },
    {
        "id": "ex_05_05",
        "exerciseGroup": "Ex_05",
        "level": 2,
        "title": {
            "uz": "Exam 05.05: Ketma-ketlikni teskari chiqarish (Revers)",
            "ru": "Exam 05.05: Реверс последовательности",
            "en": "Exam 05.05: Reverse sequence"
        },
        "topics": {
            "uz": "Dinamik massivlar, teskari tartib",
            "ru": "Динамические массивы, обратный порядок",
            "en": "Dynamic arrays, reverse order"
        },
        "description": {
            "uz": "-1 bilan tugovchi manfiy bo'lmagan sonlar ketma-ketligini teskari tartibda bo'shliq bilan ajratib chiqaring.",
            "ru": "Вывести элементы последовательности (завершается -1) в обратном порядке через пробел.",
            "en": "Print elements of sequence (-1 terminated) in reverse order separated by space."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_05/05_05.c",
        "examples": [
            {"input": "1 2 3 4 5 -1", "output": "5 4 3 2 1"},
            {"input": "1 1 1 2 2 2 -1", "output": "2 2 2 1 1 1"}
        ]
    },

    # Ex_06
    {
        "id": "ex_06_01",
        "exerciseGroup": "Ex_06",
        "level": 4,
        "title": {
            "uz": "Exam 06.01: Kvadrat matritsalarni ko'paytirish",
            "ru": "Exam 06.01: Умножение квадратных матриц",
            "en": "Exam 06.01: Square matrix multiplication"
        },
        "topics": {
            "uz": "Ikki o'lchamli massivlar, matritsalar ko'paytmasi",
            "ru": "Двумерные массивы, умножение матриц",
            "en": "2D arrays, matrix multiplication"
        },
        "description": {
            "uz": "N o'lchamli ikkita kvadrat matritsa (A va B) beriladi. Ularning ko'paytmasi C = A * B ni jadval ko'rinishida chiqaring. Qator oxirida ortiqcha bo'shliq bo'lmasin.",
            "ru": "Умножить две квадратные матрицы размера N. Результат вывести построчно через пробел.",
            "en": "Multiply two square matrices A and B of size N. Print the product matrix C = A * B row by row."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_06/06_01.c",
        "examples": [
            {"input": "2\n1 2\n3 4\n5 6\n7 8", "output": "19 22\n43 50"}
        ]
    },
    {
        "id": "ex_06_02",
        "exerciseGroup": "Ex_06",
        "level": 4,
        "title": {
            "uz": "Exam 06.02: Min va Max qatorlarini almashtirish",
            "ru": "Exam 06.02: Замена строк с min и max",
            "en": "Exam 06.02: Swapping rows with min and max"
        },
        "topics": {
            "uz": "Matritsada min/max qidirish, qatorlarni almashtirish",
            "ru": "Поиск min/max в матрице, перестановка строк",
            "en": "Matrix min/max search, row swap"
        },
        "description": {
            "uz": "M x N o'lchamli matritsa beriladi. Matritsaning eng kichik va eng katta elementi birinchi uchragan qatorlarini o'zaro almashtiring.",
            "ru": "Поменять местами строки матрицы размера M x N, содержащие первые вхождения минимального и максимального элементов.",
            "en": "Swap rows of M x N matrix containing the first occurrences of minimum and maximum elements."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_06/06_02.c",
        "examples": [
            {"input": "4 3\n1 2 3\n4 5 6\n7 8 9\n10 11 12", "output": "10 11 12\n4 5 6\n7 8 9\n1 2 3"}
        ]
    },
    {
        "id": "ex_06_03",
        "exerciseGroup": "Ex_06",
        "level": 4,
        "title": {
            "uz": "Exam 06.03: Matritsani 90° soat mili bo'yicha burish",
            "ru": "Exam 06.03: Поворот матрицы на 90 градусов",
            "en": "Exam 06.03: Matrix rotation by 90 degrees"
        },
        "topics": {
            "uz": "Matritsa indekslari bilan ishlash, burish algoritmi",
            "ru": "Манипуляции с индексами матрицы, поворот",
            "en": "Matrix indexing, 90 degree rotation"
        },
        "description": {
            "uz": "M x N o'lchamli matritsani soat mili bo'yicha 90 gradusga burib, N x M o'lchamda chop eting.",
            "ru": "Повернуть матрицу M x N на 90 градусов по часовой стрелке.",
            "en": "Rotate an M x N matrix by 90 degrees clockwise."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_06/06_03.c",
        "examples": [
            {"input": "2 3\n1 2 3\n4 5 6", "output": "4 1\n5 2\n6 3"}
        ]
    },
    {
        "id": "ex_06_04",
        "exerciseGroup": "Ex_06",
        "level": 6,
        "title": {
            "uz": "Exam 06.04: Matritsani soat mili bo'yicha spiral to'ldirish",
            "ru": "Exam 06.04: Спиральная матрица",
            "en": "Exam 06.04: Spiral matrix (clockwise)"
        },
        "topics": {
            "uz": "Spiral algoritmi, 2D massiv chegaralari",
            "ru": "Спиральное заполнение, границы матрицы",
            "en": "Spiral filling algorithm, 2D boundaries"
        },
        "description": {
            "uz": "N x N o'lchamli kvadrat matritsani yuqori chap burchakdan boshlab 1 dan N^2 gacha sonlar bilan soat mili bo'yicha spiral shaklida to'ldiring.",
            "ru": "Заполнить матрицу N x N по спирали по часовой стрелке числами от 1 до N^2 начиная с левого верхнего угла.",
            "en": "Fill N x N matrix clockwise in a spiral with numbers from 1 to N^2."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_06/06_04.c",
        "examples": [
            {"input": "2", "output": "1 2\n4 3"},
            {"input": "3", "output": "1 2 3\n8 9 4\n7 6 5"}
        ]
    },
    {
        "id": "ex_06_05",
        "exerciseGroup": "Ex_06",
        "level": 5,
        "title": {
            "uz": "Exam 06.05: Soat miliga teskari spiral (Kvadratlar)",
            "ru": "Exam 06.05: Спираль квадратов чисел (против часовой)",
            "en": "Exam 06.05: Spiral matrix (counterclockwise squares)"
        },
        "topics": {
            "uz": "Spiral algoritmi, soat miliga teskari, darajaga ko'tarish",
            "ru": "Спираль против часовой стрелки, квадраты чисел",
            "en": "Counterclockwise spiral, squared numbers"
        },
        "description": {
            "uz": "N x N matritsani 0 dan N^2-1 gacha sonlarning kvadratlari bilan yuqori chap burchakdan boshlab soat miliga teskari yo'nalishda spiral shaklida to'ldiring.",
            "ru": "Заполнить матрицу N x N квадратами чисел от 0 до N^2-1 по спирали против часовой стрелки.",
            "en": "Fill N x N matrix counterclockwise in a spiral with squares of numbers from 0 to N^2-1."
        },
        "originalCode": "",
        "c_file": "",
        "solutionCode": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n;\n    if (scanf(\"%d\", &n) != 1 || n <= 0) {\n        printf(\"n/a\");\n        return 0;\n    }\n    int **a = malloc(n * sizeof(int*));\n    for (int i = 0; i < n; i++) a[i] = malloc(n * sizeof(int));\n    \n    int val = 0;\n    int top = 0, bottom = n - 1, left = 0, right = n - 1;\n    while (top <= bottom && left <= right) {\n        // Down along left column\n        for (int i = top; i <= bottom; i++) a[i][left] = val * val, val++;\n        left++;\n        // Right along bottom row\n        for (int j = left; j <= right; j++) a[bottom][j] = val * val, val++;\n        bottom--;\n        // Up along right column\n        if (left <= right) {\n            for (int i = bottom; i >= top; i--) a[i][right] = val * val, val++;\n            right--;\n        }\n        // Left along top row\n        if (top <= bottom) {\n            for (int j = right; j >= left; j--) a[top][j] = val * val, val++;\n            top++;\n        }\n    }\n    \n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if (j == n - 1) printf(\"%d\", a[i][j]);\n            else printf(\"%d \", a[i][j]);\n        }\n        if (i < n - 1) printf(\"\\n\");\n        free(a[i]);\n    }\n    free(a);\n    return 0;\n}",
        "examples": [
            {"input": "2", "output": "0 9\n1 4"},
            {"input": "3", "output": "0 49 36\n1 64 25\n4 9 16"}
        ]
    },

    # Ex_07 (Strings)
    {
        "id": "ex_07_01",
        "exerciseGroup": "Ex_07",
        "level": 3,
        "title": {
            "uz": "Exam 07.01: Satrdagi ortiqcha bo'shliqlarni tozalash",
            "ru": "Exam 07.01: Удаление лишних пробелов",
            "en": "Exam 07.01: Remove extra spaces"
        },
        "topics": {
            "uz": "Satrlar (strings), bo'shliqlarni normalizatsiya qilish",
            "ru": "Строки, нормализация пробелов",
            "en": "Strings, space normalization"
        },
        "description": {
            "uz": "Satr kiritiladi. So'zlar orasidagi bir nechta ketma-ket kelgan bo'shliqlar o'rniga bitta bo'shliq qoldiring.",
            "ru": "Убрать лишние пробелы из строки ввода String, заменить большие пробелы на маленькие.",
            "en": "Remove extra consecutive spaces from input string, replacing them with a single space."
        },
        "originalCode": "",
        "solutionCode": "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char str[1000];\n    if (!fgets(str, sizeof(str), stdin)) {\n        printf(\"n/a\");\n        return 0;\n    }\n    int len = strlen(str);\n    if (len > 0 && str[len - 1] == '\\n') str[--len] = '\\0';\n    \n    int in_space = 0;\n    int first = 1;\n    for (int i = 0; i < len; i++) {\n        if (str[i] == ' ' || str[i] == '\\t') {\n            if (!in_space && !first) {\n                putchar(' ');\n                in_space = 1;\n            }\n        } else {\n            putchar(str[i]);\n            in_space = 0;\n            first = 0;\n        }\n    }\n    return 0;\n}",
        "examples": [
            {"input": "1    2    3    4    5", "output": "1 2 3 4 5"}
        ]
    },
    {
        "id": "ex_07_02",
        "exerciseGroup": "Ex_07",
        "level": 4,
        "title": {
            "uz": "Exam 07.02: Qism-satrning oxirgi uchrashini o'chirish",
            "ru": "Exam 07.02: Удалить последнее вхождение подстроки",
            "en": "Exam 07.02: Remove last occurrence of substring"
        },
        "topics": {
            "uz": "Satrlar, strstr / qism-satrni qidirish va o'chirish",
            "ru": "Строки, поиск и удаление последнего вхождения подстроки",
            "en": "Strings, searching and removing last substring"
        },
        "description": {
            "uz": "Ikkita satr beriladi: asosiy satr va qism-satr. Asosiy satrdan berilgan qism-satrning oxirgi marta uchragan joyini topib, uni o'chirib tashlang.",
            "ru": "Даются 2 строки: основная строка и подстрока. Найти и удалить последнее вхождение подстроки.",
            "en": "Two strings are given: text and pattern. Find and remove the last occurrence of pattern in text."
        },
        "originalCode": "",
        "solutionCode": "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char s[1000], sub[1000];\n    if (!fgets(s, sizeof(s), stdin) || !fgets(sub, sizeof(sub), stdin)) {\n        printf(\"n/a\");\n        return 0;\n    }\n    int len_s = strlen(s);\n    if (len_s > 0 && s[len_s - 1] == '\\n') s[--len_s] = '\\0';\n    int len_sub = strlen(sub);\n    if (len_sub > 0 && sub[len_sub - 1] == '\\n') sub[--len_sub] = '\\0';\n    \n    if (len_sub == 0) {\n        printf(\"%s\", s);\n        return 0;\n    }\n    \n    char *last = NULL;\n    char *cur = s;\n    while ((cur = strstr(cur, sub)) != NULL) {\n        last = cur;\n        cur += 1;\n    }\n    \n    if (last != NULL) {\n        char res[2000];\n        int idx = last - s;\n        strncpy(res, s, idx);\n        res[idx] = '\\0';\n        strcat(res, last + len_sub);\n        printf(\"%s\", res);\n    } else {\n        printf(\"%s\", s);\n    }\n    return 0;\n}",
        "examples": [
            {"input": "This is mytext\nmy", "output": "This is text"}
        ]
    },
    {
        "id": "ex_07_03",
        "exerciseGroup": "Ex_07",
        "level": 3,
        "title": {
            "uz": "Exam 07.03: Satrning palindromligini tekshirish",
            "ru": "Exam 07.03: Проверка на палиндром",
            "en": "Exam 07.03: Palindrome check"
        },
        "topics": {
            "uz": "Satrlar, registrni hisobga olmaslik (case-insensitive), palindrom",
            "ru": "Строки, регистронезависимый палиндром",
            "en": "Strings, case-insensitive palindrome"
        },
        "description": {
            "uz": "Kiritilgan satr palindrom (chapdan ham, o'ngdan ham bir xil o'qiladigan) ekanligini tekshiring. Katta-kichik harflar farqlanmaydi, bo'shliqlar inobatga olinmaydi. Agar palindrom bo'lsa 'YES', aks holda 'NO' chiqaring.",
            "ru": "Проверить, является ли строка палиндромом (регистронезависимо, пропуская пробелы). Вывести YES или NO.",
            "en": "Check if string is a palindrome (case-insensitive, ignoring spaces). Print YES or NO."
        },
        "originalCode": "",
        "solutionCode": "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n\nint main(void) {\n    char s[200];\n    if (!fgets(s, sizeof(s), stdin)) {\n        printf(\"n/a\");\n        return 0;\n    }\n    int len = strlen(s);\n    if (len > 0 && s[len - 1] == '\\n') s[--len] = '\\0';\n    \n    char clean[200];\n    int c_len = 0;\n    for (int i = 0; i < len; i++) {\n        if (isalnum((unsigned char)s[i])) {\n            clean[c_len++] = tolower((unsigned char)s[i]);\n        }\n    }\n    \n    int is_pal = 1;\n    for (int i = 0; i < c_len / 2; i++) {\n        if (clean[i] != clean[c_len - 1 - i]) {\n            is_pal = 0;\n            break;\n        }\n    }\n    if (is_pal) printf(\"YES\");\n    else printf(\"NO\");\n    return 0;\n}",
        "examples": [
            {"input": "Mam mam", "output": "YES"},
            {"input": "Test1", "output": "NO"}
        ]
    },
    {
        "id": "ex_07_04",
        "exerciseGroup": "Ex_07",
        "level": 3,
        "title": {
            "uz": "Exam 07.04: Satrni trim qilish va oraliqlarni to'g'rilash",
            "ru": "Exam 07.04: Очистка строки от пробелов (Trim)",
            "en": "Exam 07.04: String trim and normalize"
        },
        "topics": {
            "uz": "Satr boshidagi va oxiridagi bo'shliqlarni tozalash (Trim)",
            "ru": "Удаление пробелов в начале и конце строки (Trim)",
            "en": "Trimming leading and trailing spaces"
        },
        "description": {
            "uz": "Satr beriladi. Boshidagi va oxiridagi ortiqcha bo'shliqlarni olib tashlang. So'zlar orasida bittadan bo'shliq qoldiring.",
            "ru": "Убрать лишние пробелы в начале и в конце строки. Между словами оставить 1 пробел.",
            "en": "Strip leading and trailing whitespaces. Normalize whitespace between words to a single space."
        },
        "originalCode": "",
        "solutionCode": "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char s[1000];\n    if (!fgets(s, sizeof(s), stdin)) {\n        printf(\"n/a\");\n        return 0;\n    }\n    int len = strlen(s);\n    if (len > 0 && s[len - 1] == '\\n') s[--len] = '\\0';\n    \n    int start = 0;\n    while (start < len && (s[start] == ' ' || s[start] == '\\t')) start++;\n    int end = len - 1;\n    while (end >= start && (s[end] == ' ' || s[end] == '\\t')) end--;\n    \n    int in_space = 0;\n    for (int i = start; i <= end; i++) {\n        if (s[i] == ' ' || s[i] == '\\t') {\n            if (!in_space) {\n                putchar(' ');\n                in_space = 1;\n            }\n        } else {\n            putchar(s[i]);\n            in_space = 0;\n        }\n    }\n    return 0;\n}",
        "examples": [
            {"input": "   test   sample test\ttext", "output": "test sample test text"}
        ]
    },

    # Ex_08 (Structures)
    {
        "id": "ex_08_01",
        "exerciseGroup": "Ex_08",
        "level": 5,
        "title": {
            "uz": "Exam 08.01: Talabalar strukturasi (O'rtacha balldan yuqori)",
            "ru": "Exam 08.01: Структура Student (Выше среднего балла)",
            "en": "Exam 08.01: Student struct (Above average score)"
        },
        "topics": {
            "uz": "Strukturalar (struct), dinamik xotira, o'rtacha qiymat",
            "ru": "Структуры (struct), динамическая память, средний балл",
            "en": "Structures, dynamic memory, average score"
        },
        "description": {
            "uz": "Talaba ismi va bahosidan iborat struct student yarating. Talabalar soni n kiritiladi. O'rtacha balldan yuqori ball olgan barcha talabalar ismini vergul va bo'shliq bilan ajratib chiqaring.",
            "ru": "Создать структуру student (имя, оценка). Вывести имена всех студентов, чей балл выше среднего, через запятую с пробелом.",
            "en": "Create student struct (name, mark). Print all students with mark above average, comma-separated."
        },
        "originalCode": "",
        "c_file": "21-Exam/Ex_08/08_01(v.2).c",
        "examples": [
            {"input": "3\nAndrey\n15\nSergey\n20\nAnton\n10", "output": "Sergey"}
        ]
    },
    {
        "id": "ex_08_02",
        "exerciseGroup": "Ex_08",
        "level": 5,
        "title": {
            "uz": "Exam 08.02: Talabalarni ballari bo'yicha saralash",
            "ru": "Exam 08.02: Сортировка студентов по баллам",
            "en": "Exam 08.02: Sort students by score"
        },
        "topics": {
            "uz": "Strukturalarni saralash (qsort / bubble sort)",
            "ru": "Сортировка структур по оценкам",
            "en": "Sorting structs by marks"
        },
        "description": {
            "uz": "Talabalarni to'plagan ballari bo'yicha kamayish tartibida saralang va har bir talabaning ismini alohida qatorda chiqaring.",
            "ru": "Отсортировать студентов по убыванию баллов и вывести их имена построчно.",
            "en": "Sort students in descending order of their marks and print names line by line."
        },
        "originalCode": "",
        "solutionCode": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nstruct Student {\n    char name[100];\n    int mark;\n};\n\nint main(void) {\n    int n;\n    if (scanf(\"%d\", &n) != 1 || n <= 0) {\n        printf(\"n/a\");\n        return 0;\n    }\n    struct Student *s = malloc(n * sizeof(struct Student));\n    for (int i = 0; i < n; i++) {\n        if (scanf(\"%99s %d\", s[i].name, &s[i].mark) != 2) {\n            printf(\"n/a\");\n            free(s);\n            return 0;\n        }\n    }\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (s[j].mark < s[j + 1].mark) {\n                struct Student tmp = s[j];\n                s[j] = s[j + 1];\n                s[j + 1] = tmp;\n            }\n        }\n    }\n    for (int i = 0; i < n; i++) {\n        if (i == n - 1) printf(\"%s\", s[i].name);\n        else printf(\"%s\\n\", s[i].name);\n    }\n    free(s);\n    return 0;\n}",
        "examples": [
            {"input": "3\nAndrey\n15\nSergey\n20\nAnton\n10", "output": "Sergey\nAndrey\nAnton"}
        ]
    }
]

# Process and load solutionCode from c_file if present
for task in TASKS:
    c_file = task.get("c_file")
    if c_file and os.path.exists(c_file):
        with open(c_file, 'r', errors='ignore') as f:
            code = f.read().strip()
            task["solutionCode"] = code

# Save to src/data/c_practical.json
out_path = 'src/data/c_practical.json'
with open(out_path, 'w', encoding='utf-8') as out:
    json.dump({"exercises": TASKS}, out, ensure_ascii=False, indent=2)

print(f"Successfully generated {out_path} with {len(TASKS)} practical tasks!")
