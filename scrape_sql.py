#!/usr/bin/env python3
"""
Scrapes all SQL theory & practice exam questions from https://widum.ru/s21/sql/
via WordPress REST API: https://widum.ru/wp-json/wp/v2/pages/7153?_fields=content
"""

import urllib.request
import json
import re
import base64
import html
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

URL = "https://widum.ru/wp-json/wp/v2/pages/7153?_fields=content"
OUTPUT_FILE = "/home/laziz/devops/sql_exam_questions.json"

def clean_question_html(raw_html):
    """
    Converts question HTML into clean Markdown, preserving tables and code blocks.
    """
    # Convert HTML table to Markdown table
    def table_to_md(m):
        table_html = m.group(1)
        rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table_html, re.DOTALL)
        md_rows = []
        has_header = False
        for i, row in enumerate(rows):
            ths = re.findall(r"<th[^>]*>(.*?)</th>", row, re.DOTALL)
            tds = re.findall(r"<td[^>]*>(.*?)</td>", row, re.DOTALL)
            cells = ths if ths else tds
            clean_cells = [re.sub(r"<[^>]+>", "", c).strip() for c in cells]
            if clean_cells:
                md_rows.append("| " + " | ".join(clean_cells) + " |")
                if ths or (i == 0 and not has_header):
                    md_rows.append("| " + " | ".join(["---"] * len(clean_cells)) + " |")
                    has_header = True
        return "\n\n" + "\n".join(md_rows) + "\n\n"

    res = re.sub(r"<table[^>]*>(.*?)</table>", table_to_md, raw_html, flags=re.DOTALL)

    # Convert pre/code blocks
    res = re.sub(r"<pre[^>]*><code[^>]*>(.*?)</code></pre>", lambda m: f"\n```sql\n{m.group(1).strip()}\n```\n", res, flags=re.DOTALL)
    res = re.sub(r"<code[^>]*>(.*?)</code>", lambda m: f"`{m.group(1).strip()}`", res, flags=re.DOTALL)

    # Paragraphs and line breaks
    res = re.sub(r"</p>", "\n", res)
    res = re.sub(r"<br\s*/?>", "\n", res)

    # Strip remaining HTML tags
    res = re.sub(r"<[^>]+>", "", res)

    # Unescape HTML entities
    res = html.unescape(res)

    # Clean whitespace and lines
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in res.split("\n")]
    res = "\n".join(lines)
    res = re.sub(r"\n{3,}", "\n\n", res).strip()

    # Remove leading transient question counter (e.g., "1. ")
    res = re.sub(r"^\d+\.\s*", "", res)
    return res

def parse_rendered_html(rendered_content):
    questions = {}

    quiz_options = {}
    for m in re.finditer(r"window\.quizOptions_\d+\[[\x27\"](\d+)[\x27\"]\]\s*=\s*[\x27\"]([A-Za-z0-9+/=]+)[\x27\"]", rendered_content):
        qid, b64 = m.group(1), m.group(2)
        try:
            decoded = json.loads(base64.b64decode(b64).decode("utf-8"))
            quiz_options[qid] = decoded.get("question_answer", {})
        except Exception:
            pass

    step_pattern = re.compile(
        r"<div[^>]*class=[\x27\"][^\x27\"]*step[^\x27\"]*[\x27\"][^>]*data-question-id=[\x27\"](\d+)[\x27\"][^>]*>(.*?)(?=<div[^>]*class=[\x27\"][^\x27\"]*step[^\x27\"]*[\x27\"][^>]*data-question-id|\Z)",
        re.DOTALL
    )

    for m in step_pattern.finditer(rendered_content):
        qid = m.group(1)
        step_html = m.group(2)

        header_part = rendered_content[max(0, m.start() - 50):m.start() + 250]
        qtype_m = re.search(r"data-type=[\x27\"]([^\x27\"]+)[\x27\"]", header_part)
        qtype = qtype_m.group(1) if qtype_m else "radio"

        qtext = ""
        qtext_m = re.search(r"<div class=[\x27\"]ays_quiz_question[\x27\"][^>]*>(.*?)</div>", step_html, re.DOTALL)
        if qtext_m:
            qtext = clean_question_html(qtext_m.group(1))

        qimg_m = re.search(r"<div class=[\x27\"]ays-image-question-img[\x27\"][^>]*>.*?<img[^>]*src=[\x27\"]([^\x27\"]+)[\x27\"]", step_html, re.DOTALL)
        qimg = qimg_m.group(1) if qimg_m else None

        answers = []
        correct_answers = []
        correct_map = quiz_options.get(qid, {})

        ans_pattern = re.compile(
            r"<div class=[\x27\"]ays-field[^\x27\"]*[\x27\"][^>]*>(.*?)(?=<div class=[\x27\"]ays-field|\Z)",
            re.DOTALL
        )

        for am in ans_pattern.finditer(step_html):
            f_html = am.group(1)

            val_m = re.search(r"<input[^>]*type=[\x27\"](?:radio|checkbox)[\x27\"][^>]*value=[\x27\"](\d+)[\x27\"]", f_html)
            ans_id = val_m.group(1) if val_m else None
            if not ans_id:
                id_m = re.search(r"id=[\x27\"]ays-answer-(\d+)-", f_html)
                ans_id = id_m.group(1) if id_m else ""

            lbl_m = re.search(r"<label[^>]*class=[\x27\"][^\x27\"]*ays_position_initial[^\x27\"]*[\x27\"][^>]*>(.*?)</label>", f_html, re.DOTALL)
            ans_text = ""
            if lbl_m:
                raw_ans = re.sub(r"<[^>]+>", " ", lbl_m.group(1))
                ans_text = html.unescape(raw_ans).strip()
                ans_text = re.sub(r"\s+", " ", ans_text)

            aimg_m = re.search(r"<img[^>]*src=[\x27\"]([^\x27\"]+)[\x27\"]", f_html)
            ans_img = aimg_m.group(1) if aimg_m else None

            is_correct = (correct_map.get(ans_id) == "1")

            if ans_id or ans_text:
                answers.append({
                    "id": ans_id,
                    "text": ans_text,
                    "is_correct": is_correct,
                    "image": ans_img
                })
                if is_correct:
                    correct_answers.append(ans_text)

        exp_m = re.search(r"<div class=[\x27\"]ays_questtion_explanation[\x27\"][^>]*>(.*?)</div>", step_html, re.DOTALL)
        explanation = ""
        if exp_m:
            raw_exp = re.sub(r"<[^>]+>", " ", exp_m.group(1))
            raw_exp = html.unescape(raw_exp).strip()
            explanation = re.sub(r"\s+", " ", raw_exp)

        questions[qid] = {
            "id": int(qid),
            "type": qtype,
            "question": qtext,
            "image": qimg,
            "answers": answers,
            "correct_answers": correct_answers,
            "explanation": explanation
        }

    return questions

def fetch_batch():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64)"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return parse_rendered_html(data["content"]["rendered"])

def main():
    print("Collecting SQL exam questions (theory and practice)...")
    all_questions = {}
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=3) as executor:
        for round_idx in range(4):
            futures = [executor.submit(fetch_batch) for _ in range(3)]
            for fut in as_completed(futures):
                try:
                    q_batch = fut.result()
                    all_questions.update(q_batch)
                except Exception as e:
                    print(f"Error: {e}", file=sys.stderr)
            print(f"Round {round_idx+1}: {len(all_questions)} unique questions...")
            time.sleep(0.3)

    sorted_questions = sorted(all_questions.values(), key=lambda x: x["id"])

    output_data = {
        "source": "https://widum.ru/s21/sql/",
        "title": "Школа 21. Экзамен SQL (теория и практика)",
        "total_questions": len(sorted_questions),
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "questions": sorted_questions
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Collected {len(sorted_questions)} SQL questions in {time.time() - start_time:.1f}s.")
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
