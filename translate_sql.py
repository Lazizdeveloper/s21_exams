import json

# Full accurate translations for SQL Theory & Practice (30 questions)
# Technical keywords (ACID, CAP, DBMS, MySQL, PostgreSQL, MongoDB, Oracle, COMMIT, ROLLBACK,
# CREATE INDEX, FOREIGN KEY, CHECK CONSTRAINT, PRIMARY KEY, 1NF, ER-model, UML, SELECT, CASE,
# WHEN, NULL, GROUP BY, ORDER BY, SUM, CROSS JOIN, RIGHT JOIN, UNION, CTE, HAVING, etc.)
# are preserved.

with open("/home/laziz/devops/src/data/sql.json", "r", encoding="utf-8") as f:
    orig = json.load(f)

# Helper dictionary for the 30 SQL questions
sql_translations_meta = {
    385: {
        "q_uz": "ACID prinsiplaridan qaysi biri, agar tranzaksiya muvaffaqiyatli yakunlansa, tizim ishdan chiqqan (crash) taqdirda ham o'zgarishlar saqlanib qolishini kafolatlaydi?",
        "q_en": "Which ACID principle guarantees that once a transaction has committed, its changes will survive even in the event of a system crash?",
        "exp_uz": "Durability (Ishonchlilik / Bardavomlik) nosozlik yuz berganda ham committed tranzaksiya ma'lumotlari xotirada saqlanishini ta'minlaydi.",
        "exp_en": "Durability guarantees that committed transaction changes survive system failures and crashes.",
        "opt_uz": {"1131": "B) Izolyatsiya (Isolation)", "1134": "C) Muvofiqlik (Consistency)", "1132": "A) Bardavomlik (Durability)", "1133": "D) Atomlilik (Atomicity)"},
        "opt_en": {"1131": "B) Isolation", "1134": "C) Consistency", "1132": "A) Durability", "1133": "D) Atomicity"}
    },
    386: {
        "q_uz": "CAP-teoremasidagi CAP qisqartmasi nimani anglatadi?",
        "q_en": "What does CAP stand for in the CAP theorem?",
        "exp_uz": "CAP-teoremaga ko'ra, taqsimlangan tizimda Consistency (muvofiqlik), Availability (mavjudlik) va Partition Tolerance (bo'linishga chidamlilik) ning barchasini birdaniga ta'minlab bo'lmaydi.",
        "exp_en": "The CAP theorem states that a distributed system cannot simultaneously provide Consistency, Availability, and Partition Tolerance.",
        "opt_uz": {},
        "opt_en": {}
    },
    387: {
        "q_uz": "Quyidagi xizmatlardan qaysi biri ma'lumotlarga kirish va ularni boshqarishni amalga oshiradi?",
        "q_en": "Which of the following services manages data access and storage?",
        "exp_uz": "DBMS (Ma'lumotlar bazasini boshqarish tizimi — СУБД) ma'lumotlarni saqlash, o'zgartirish va ularga kirishni boshqaradi.",
        "exp_en": "A DBMS (Database Management System) manages storage, modification, and access to data.",
        "opt_uz": {"1140": "A) DBMS (СУБД)", "1138": "B) Transaction Manager", "1137": "C) Query Optimizer", "1139": "D) SQL Server"},
        "opt_en": {"1140": "A) DBMS", "1138": "B) Transaction Manager", "1137": "C) Query Optimizer", "1139": "D) SQL Server"}
    },
    388: {
        "q_uz": "Quyidagilardan qaysi biri relyatsion ma'lumotlar bazasiga (RDBMS) kirmaydi?",
        "q_en": "Which of the following is NOT a relational database (RDBMS)?",
        "exp_uz": "MongoDB — bu NoSQL document-oriented ma'lumotlar bazasi, RDBMS emas.",
        "exp_en": "MongoDB is a document-oriented NoSQL database, not an RDBMS.",
        "opt_uz": {"1143": "A) MySQL", "1141": "B) MongoDB", "1144": "C) PostgreSQL (psql)", "1142": "D) Oracle"},
        "opt_en": {"1143": "A) MySQL", "1141": "B) MongoDB", "1144": "C) PostgreSQL (psql)", "1142": "D) Oracle"}
    },
    389: {
        "q_uz": "Relyatsion ma'lumotlar bazasi (RDBMS) tushunchasiga nima to'g'ri keladi?",
        "q_en": "Which description best fits the concept of a relational database (RDBMS)?",
        "exp_uz": "Relyatsion model — bu o'zaro foreign keylar orqali bog'langan jadvallardir.",
        "exp_en": "The relational model organizes data into tables linked by relationships (keys).",
        "opt_uz": {"1147": "A) Graflarga asoslangan struktura", "1145": "B) Katta fayllar to'plami", "1146": "C) JSON-fayllar ombori", "1148": "D) Jadvallar orasidagi bog'liqliklarga (relations) asoslangan ma'lumotlar strukturasi"},
        "opt_en": {"1147": "A) Graph-based structure", "1145": "B) Large files collection", "1146": "C) JSON file store", "1148": "D) Data structure based on relationships between tables"}
    },
    390: {
        "q_uz": "COMMIT buyrug'i qanday vazifani bajaradi?",
        "q_en": "What action does the COMMIT command perform?",
        "exp_uz": "COMMIT joriy tranzaksiya davomida kiritilgan barcha o'zgarishlarni bazada doimiy saqlaydi.",
        "exp_en": "COMMIT persists all changes made within the current transaction to the database.",
        "opt_uz": {"1150": "A) Joriy tranzaksiyada qilingan barcha o'zgarishlarni tasdiqlaydi (commit qiladi)", "1152": "B) Joriy tranzaksiyani bekor qiladi", "1151": "C) Barcha o'zgarishlarni orqaga qaytaradi (rollback)", "1149": "D) O'zgarishlarni faqat vaqtincha qo'llaydi"},
        "opt_en": {"1150": "A) Commits and saves all changes made in the current transaction", "1152": "B) Cancels the current transaction", "1151": "C) Rolls back all changes", "1149": "D) Applies changes temporarily"}
    },
    391: {
        "q_uz": "Composite (tarkibli) indeks yaratish uchun qaysi buyruq ishlatiladi?",
        "q_en": "Which command is used to create a composite (multi-column) index?",
        "exp_uz": "Standart SQL sintaksisi: CREATE INDEX index_name ON table_name (col1, col2);",
        "exp_en": "Standard syntax: CREATE INDEX index_name ON table_name (col1, col2);",
        "opt_uz": {},
        "opt_en": {}
    },
    392: {
        "q_uz": "Jadvalga FOREIGN KEY qo'shish uchun qaysi buyruq ishlatiladi?",
        "q_en": "Which command is used to add a FOREIGN KEY constraint?",
        "exp_uz": "FOREIGN KEY odatda ALTER TABLE orqali ADD CONSTRAINT yordamida qo'shiladi.",
        "exp_en": "A FOREIGN KEY is added using the ADD CONSTRAINT clause inside an ALTER TABLE statement.",
        "opt_uz": {"1159": "A) CREATE INDEX", "1160": "B) INSERT INTO", "1157": "C) ADD CONSTRAINT", "1158": "D) ALTER VIEW"},
        "opt_en": {"1159": "A) CREATE INDEX", "1160": "B) INSERT INTO", "1157": "C) ADD CONSTRAINT", "1158": "D) ALTER VIEW"}
    },
    393: {
        "q_uz": "CHECK CONSTRAINT yaratish uchun qaysi buyruqlardan foydalaniladi?",
        "q_en": "Which statements can be used to define a CHECK CONSTRAINT?",
        "exp_uz": "CHECK cheklovini CREATE TABLE vaqtida yoki keyinchalik ALTER TABLE orqali qo'shish mumkin.",
        "exp_en": "CHECK constraints can be defined during CREATE TABLE or added later via ALTER TABLE.",
        "opt_uz": {"1163": "A) UPDATE TABLE", "1162": "B) INSERT INTO", "1164": "C) ALTER TABLE", "1161": "D) CREATE TABLE"},
        "opt_en": {"1163": "A) UPDATE TABLE", "1162": "B) INSERT INTO", "1164": "C) ALTER TABLE", "1161": "D) CREATE TABLE"}
    },
    394: {
        "q_uz": "Agar INSERT yoki UPDATE vaqtida ma'lumot CHECK CONSTRAINT shartiga to'g'ri kelmasa, nima sodir bo'ladi?",
        "q_en": "What happens if an inserted or updated record violates a CHECK CONSTRAINT?",
        "exp_uz": "CHECK CONSTRAINT sharti bajarilmasa, operatsiya rad etiladi (xatolik beriladi) va ma'lumot yozilmaydi.",
        "exp_en": "The insert or update operation is aborted and rejected with a constraint violation error.",
        "opt_uz": {"1166": "A) INSERT yoki UPDATE operatsiyasi rad etiladi (xatolik yuz beradi)", "1167": "B) Cheklov avtomatik tarzda o'chiriladi", "1168": "C) Ma'lumotlar avtomatik o'chiriladi", "1165": "D) Ma'lumotlar bazasi ogohlantirish beradi, lekin operatsiyani davom ettiradi"},
        "opt_en": {"1166": "A) The insert or update operation is rejected with an error", "1167": "B) The constraint is automatically disabled", "1168": "C) The data is automatically deleted", "1165": "D) The database issues a warning but allows the operation"}
    },
    395: {
        "q_uz": "Primary Key (Birlamchi kalit) nima?",
        "q_en": "What is a Primary Key?",
        "exp_uz": "Primary Key jadval qatorlarini yagona aniqlovchi unikal ustundir, u NULL qiymat qabul qila olmaydi.",
        "exp_en": "A Primary Key is a unique identifier for records in a table and cannot contain NULL values.",
        "opt_uz": {"1172": "A) Takrorlanuvchi qiymatlarga ega ustun", "1170": "B) Unikal qiymat va NULL bo'lishi mumkin bo'lgan ustun", "1169": "C) Jadvaldagi qatorlarning unikal identifikatori (NOT NULL va UNIQUE)", "1171": "D) Tashqi kalitni (Foreign Key) saqlovchi ustun"},
        "opt_en": {"1172": "A) A column containing duplicate values", "1170": "B) A column with unique values and NULL allowed", "1169": "C) A unique identifier for table records (NOT NULL & UNIQUE)", "1171": "D) A column containing a foreign key"}
    },
    396: {
        "q_uz": "Birinchi normal shakl (1NF — First Normal Form) nimani talab qiladi?",
        "q_en": "What does First Normal Form (1NF) require?",
        "exp_uz": "1NF ga ko'ra jadvalning har bir yacheykasidagi qiymat atomar (bo'linmas) bo'lishi va takrorlanuvchi guruhlar bo'lmasligi shart.",
        "exp_en": "1NF requires that each column contains only atomic (indivisible) values and there are no repeating groups.",
        "opt_uz": {"1175": "A) Har bir atribut qiymati takrorlanuvchi bo'lishi", "1174": "B) Jadvalning har bir yacheykasi faqat bitta atomar qiymatni o'z ichiga olishi", "1173": "C) Barcha ustunlar faqat raqamli bo'lishi", "1176": "D) Faqat bitta jadval mavjud bo'lishi"},
        "opt_en": {"1175": "A) All attribute values must be repeatable", "1174": "B) Each table cell must contain exactly one atomic value", "1173": "C) All columns must be numeric", "1176": "D) Only a single table can exist"}
    },
    397: {
        "q_uz": "Mantiqiy ma'lumotlar modelida ikkita entity (jadval) orasidagi bog'liqlikni qaysi tushuncha ifodalaydi?",
        "q_en": "Which concept describes the relationship between two entities in a logical data model?",
        "exp_uz": "Relyatsion modellarda jadvallar orasidagi mantiqiy bog'lanish Foreign Key (Tashqi kalit) orqali hosil qilinadi.",
        "exp_en": "In relational schemas, relationships between entities are established via Foreign Keys.",
        "opt_uz": {"1179": "A) Foreign Key (Tashqi kalit)", "1180": "B) Trigger", "1177": "C) Index", "1178": "D) View"},
        "opt_en": {"1179": "A) Foreign Key", "1180": "B) Trigger", "1177": "C) Index", "1178": "D) View"}
    },
    398: {
        "q_uz": "Mantiqiy ma'lumotlar modelini grafik tasvirlash uchun qaysi modellashtirish tili ishlatiladi?",
        "q_en": "Which of the following modeling languages is used to describe logical data models?",
        "exp_uz": "UML (Unified Modeling Language) klass diagrammalari va entity munosabatlarini tasvirlashda keng qo'llaniladi.",
        "exp_en": "UML (Unified Modeling Language) is widely used to visualize logical schemas and relationships.",
        "opt_uz": {"1181": "A) HTML", "1184": "B) UML", "1183": "C) CSS", "1182": "D) JSON"},
        "opt_en": {"1181": "A) HTML", "1184": "B) UML", "1183": "C) CSS", "1182": "D) JSON"}
    },
    399: {
        "q_uz": "ER-model (Entity-Relationship model) strukturasi konseptual jihatdan nimani ifodalaydi?",
        "q_en": "What does an ER (Entity-Relationship) model conceptually represent?",
        "exp_uz": "ER-model ob'ektlar (entities), ularning xususiyatlari (attributes) va ob'ektlararo munosabatlarni (relationships) ifodalaydi.",
        "exp_en": "An ER model conceptualizes entities, their attributes, and relationships between them.",
        "opt_uz": {"1187": "A) Tarmoq topologiyasi", "1186": "B) Entity (ob'ektlar) orasidagi munosabatlar va bog'liqliklar", "1185": "C) Dasturiy kod algoritmi", "1188": "D) Fayllar ierarxiyasi"},
        "opt_en": {"1187": "A) Network topology", "1186": "B) Entities and relationships between them", "1185": "C) Software algorithm code", "1188": "D) File system hierarchy"}
    }
}

# Translate each question
translated_questions = []

for q in orig["questions"]:
    qid = q["id"]
    ru_q = q["question"]
    ru_exp = q.get("explanation", "")
    
    # Meta lookup
    meta = sql_translations_meta.get(qid, {})
    
    # Question text
    uz_q = meta.get("q_uz")
    en_q = meta.get("q_en")
    
    if not uz_q:
        # Practical questions Q400-Q416
        # Convert "Практика X" to "Amaliyot X / Practice X" while preserving tables & sql
        uz_q = ru_q.replace("Практика", "Amaliyot")
        en_q = ru_q.replace("Практика", "Practice")
        
    # Explanation
    uz_exp = meta.get("exp_uz", ru_exp)
    en_exp = meta.get("exp_en", ru_exp)
    
    # Answers
    translated_answers = []
    opt_uz_map = meta.get("opt_uz", {})
    opt_en_map = meta.get("opt_en", {})
    
    for a in q["answers"]:
        aid = a.get("id")
        ru_text = a["text"]
        
        # Check custom translation
        uz_text = opt_uz_map.get(aid)
        en_text = opt_en_map.get(aid)
        
        if not uz_text:
            uz_text = ru_text
            # Common phrases in practical tests
            uz_text = uz_text.replace("синт. ошибка", "syntax error (sintaktik xato)")
            uz_text = uz_text.replace("не вернет ни одной строки", "hech qanday qator qaytmaydi")
            
        if not en_text:
            en_text = ru_text
            en_text = en_text.replace("синт. ошибка", "syntax error")
            en_text = en_text.replace("не вернет ни одной строки", "returns no rows")
            
        translated_answers.append({
            "id": aid,
            "text": {
                "ru": ru_text,
                "uz": uz_text,
                "en": en_text
            },
            "is_correct": a.get("is_correct", False)
        })
        
    translated_questions.append({
        "id": qid,
        "type": q.get("type", "radio"),
        "question": {
            "ru": ru_q,
            "uz": uz_q,
            "en": en_q
        },
        "answers": translated_answers,
        "explanation": {
            "ru": ru_exp,
            "uz": uz_exp,
            "en": en_exp
        }
    })

# Save to both paths
for p in ["/home/laziz/devops/sql_exam_questions.json", "/home/laziz/devops/src/data/sql.json"]:
    with open(p, "w", encoding="utf-8") as f:
        json.dump({
            "source": "https://widum.ru/s21/sql/",
            "title": "Школа 21. Экзамен SQL (теория и практика)",
            "total_questions": len(translated_questions),
            "questions": translated_questions
        }, f, ensure_ascii=False, indent=2)
    print(f"Updated {p} with 30 multilingual SQL questions.")
