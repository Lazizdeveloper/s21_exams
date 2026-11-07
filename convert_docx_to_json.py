#!/usr/bin/env python3
"""
Parses exam-questions-UZB.docx, exam-questions-RUS.docx, and exam-questions-ENG.docx
and creates structured JSON files:
- http_js_exam_multilingual.json (unified multi-language dataset)
- http_js_exam_UZ.json
- http_js_exam_RU.json
- http_js_exam_EN.json
"""

import zipfile
import xml.etree.ElementTree as ET
import json
import re
import os

DOCX_FILES = {
    "uz": "/home/laziz/devops/exam-questions-UZB.docx",
    "ru": "/home/laziz/devops/exam-questions-RUS.docx",
    "en": "/home/laziz/devops/exam-questions-ENG.docx"
}

def parse_docx(fname):
    with zipfile.ZipFile(fname) as z:
        tree = ET.fromstring(z.read("word/document.xml"))
        namespaces = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        paragraphs = ["".join([t.text for t in p.findall(".//w:t", namespaces) if t.text]).strip() 
                      for p in tree.findall(".//w:p", namespaces)]
            
    questions = []
    current_q = None
    current_opt = None
    
    for p in paragraphs:
        if not p:
            continue
            
        q_m = re.match(r"^(\d+)\.\s*(.*)", p)
        if q_m:
            if current_q:
                questions.append(current_q)
            current_q = {
                "number": int(q_m.group(1)),
                "question": q_m.group(2).strip(),
                "options": {},
                "correct_answer": None
            }
            current_opt = None
            continue
            
        if current_q is not None:
            ans_m = re.search(r"(?:To[‘\x27]g[‘\x27]ri javob|Правильный ответ|Correct answer):\s*([A-D])", p, re.IGNORECASE)
            if ans_m:
                current_q["correct_answer"] = ans_m.group(1).upper()
                current_opt = None
                continue
                
            opt_m = re.match(r"^([A-D])\)(.*)", p)
            if opt_m:
                opt_letter = opt_m.group(1).upper()
                opt_rest = opt_m.group(2).strip()
                current_opt = opt_letter
                current_q["options"][opt_letter] = [opt_rest] if opt_rest else []
                continue
                
            if current_opt is not None:
                current_q["options"][current_opt].append(p)
                continue
                
    if current_q:
        questions.append(current_q)
        
    # Format option text (join lines, strip extra spaces)
    for q in questions:
        for opt_key, lines in q["options"].items():
            clean_lines = [l for l in lines if l]
            # If multiple lines (e.g. code block), join with newline
            if len(clean_lines) > 1:
                q["options"][opt_key] = "\n".join(clean_lines)
            elif len(clean_lines) == 1:
                q["options"][opt_key] = clean_lines[0]
            else:
                q["options"][opt_key] = ""
                
    return questions

def main():
    print("Reading and parsing DOCX files...")
    parsed_by_lang = {}
    for lang, path in DOCX_FILES.items():
        if not os.path.exists(path):
            raise FileNotFoundError(f"File not found: {path}")
        parsed_by_lang[lang] = parse_docx(path)
        print(f"  {lang.upper()}: {len(parsed_by_lang[lang])} questions parsed successfully.")

    total_q = len(parsed_by_lang["uz"])
    unified_questions = []

    for i in range(total_q):
        u_q = parsed_by_lang["uz"][i]
        r_q = parsed_by_lang["ru"][i]
        e_q = parsed_by_lang["en"][i]

        correct_opt = u_q["correct_answer"]
        options_list = []

        for key in ["A", "B", "C", "D"]:
            is_corr = (key == correct_opt)
            options_list.append({
                "key": key,
                "text": {
                    "uz": u_q["options"].get(key, ""),
                    "ru": r_q["options"].get(key, ""),
                    "en": e_q["options"].get(key, "")
                },
                "is_correct": is_corr
            })

        # Check if option is code block (e.g. has "class " or "function" or newlines)
        is_code = any("\n" in opt["text"]["en"] or "class " in opt["text"]["en"] for opt in options_list)

        unified_questions.append({
            "id": i + 1,
            "number": i + 1,
            "category": "HTTP, Networks & JavaScript",
            "is_code": is_code,
            "question": {
                "uz": u_q["question"],
                "ru": r_q["question"],
                "en": e_q["question"]
            },
            "correct_option": correct_opt,
            "options": options_list
        })

    # Save unified multilingual JSON
    multilingual_data = {
        "title": {
            "uz": "Imtihon savollari — HTTP, tarmoqlar va JavaScript",
            "ru": "Экзаменационные вопросы — HTTP, сети и JavaScript",
            "en": "Exam Questions — HTTP, Networking & JavaScript"
        },
        "category": "HTTP, Networks & JavaScript",
        "total_questions": len(unified_questions),
        "languages": ["uz", "ru", "en"],
        "questions": unified_questions
    }

    multilingual_path = "/home/laziz/devops/http_js_exam_multilingual.json"
    with open(multilingual_path, "w", encoding="utf-8") as f:
        json.dump(multilingual_data, f, ensure_ascii=False, indent=2)
    print(f"Saved unified JSON: {multilingual_path}")

    # Save per-language JSONs
    for lang, fname_suffix in [("uz", "UZ"), ("ru", "RU"), ("en", "ENG")]:
        lang_questions = []
        for q in unified_questions:
            lang_questions.append({
                "id": q["id"],
                "number": q["number"],
                "category": q["category"],
                "is_code": q["is_code"],
                "question": q["question"][lang],
                "correct_option": q["correct_option"],
                "options": [
                    {
                        "key": opt["key"],
                        "text": opt["text"][lang],
                        "is_correct": opt["is_correct"]
                    }
                    for opt in q["options"]
                ],
                "correct_answer_text": next(opt["text"][lang] for opt in q["options"] if opt["is_correct"])
            })

        out_path = f"/home/laziz/devops/http_js_exam_{fname_suffix}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({
                "title": multilingual_data["title"][lang],
                "category": multilingual_data["category"],
                "language": lang,
                "total_questions": len(lang_questions),
                "questions": lang_questions
            }, f, ensure_ascii=False, indent=2)
        print(f"Saved {lang.upper()} JSON: {out_path}")

if __name__ == "__main__":
    main()
