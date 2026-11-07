#!/usr/bin/env python3
"""
Scrapes all 287 DevOps exam questions from https://widum.ru/s21/devops/
via the WordPress REST API endpoint: https://widum.ru/wp-json/wp/v2/pages/6995?_fields=content
"""

import urllib.request
import json
import re
import base64
import html
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

URL = "https://widum.ru/wp-json/wp/v2/pages/6995?_fields=content"
TARGET_TOTAL = 287
OUTPUT_FILE = "/home/laziz/devops/devops_exam_questions.json"

def parse_rendered_html(rendered_content):
    """
    Parses a rendered Quiz Maker HTML block to extract questions,
    answers, correct choices, and explanations.
    """
    questions = {}

    # Extract base64 encoded correct answer mappings
    # window.quizOptions_6['483'] = '...';
    quiz_options = {}
    for m in re.finditer(r"window\.quizOptions_\d+\[[\x27\"](\d+)[\x27\"]\]\s*=\s*[\x27\"]([A-Za-z0-9+/=]+)[\x27\"]", rendered_content):
        qid, b64 = m.group(1), m.group(2)
        try:
            decoded = json.loads(base64.b64decode(b64).decode("utf-8"))
            quiz_options[qid] = decoded.get("question_answer", {})
        except Exception:
            pass

    # Find step elements
    step_pattern = re.compile(
        r"<div[^>]*class=[\x27\"][^\x27\"]*step[^\x27\"]*[\x27\"][^>]*data-question-id=[\x27\"](\d+)[\x27\"][^>]*>(.*?)(?=<div[^>]*class=[\x27\"][^\x27\"]*step[^\x27\"]*[\x27\"][^>]*data-question-id|\Z)",
        re.DOTALL
    )

    for m in step_pattern.finditer(rendered_content):
        qid = m.group(1)
        step_html = m.group(2)

        # Question type
        header_part = rendered_content[max(0, m.start() - 50):m.start() + 250]
        qtype_m = re.search(r"data-type=[\x27\"]([^\x27\"]+)[\x27\"]", header_part)
        qtype = qtype_m.group(1) if qtype_m else "radio"

        # Question text
        qtext = ""
        qtext_m = re.search(r"<div class=[\x27\"]ays_quiz_question[\x27\"][^>]*>(.*?)</div>", step_html, re.DOTALL)
        if qtext_m:
            raw_text = re.sub(r"<[^>]+>", " ", qtext_m.group(1))
            raw_text = html.unescape(raw_text).strip()
            raw_text = re.sub(r"\s+", " ", raw_text)
            # Remove transient leading question number (e.g., "12. What is...")
            clean_text = re.sub(r"^\d+\.\s*", "", raw_text)
            qtext = clean_text

        # Question image if present
        qimg_m = re.search(r"<div class=[\x27\"]ays-image-question-img[\x27\"][^>]*>.*?<img[^>]*src=[\x27\"]([^\x27\"]+)[\x27\"]", step_html, re.DOTALL)
        qimg = qimg_m.group(1) if qimg_m else None

        # Answers
        answers = []
        correct_answers = []
        correct_map = quiz_options.get(qid, {})

        # Each field contains an answer option
        ans_pattern = re.compile(
            r"<div class=[\x27\"]ays-field[^\x27\"]*[\x27\"][^>]*>(.*?)(?=<div class=[\x27\"]ays-field|\Z)",
            re.DOTALL
        )

        for am in ans_pattern.finditer(step_html):
            f_html = am.group(1)

            # Option input id/value
            val_m = re.search(r"<input[^>]*type=[\x27\"](?:radio|checkbox)[\x27\"][^>]*value=[\x27\"](\d+)[\x27\"]", f_html)
            ans_id = val_m.group(1) if val_m else None
            if not ans_id:
                # Fallback to id attribute
                id_m = re.search(r"id=[\x27\"]ays-answer-(\d+)-", f_html)
                ans_id = id_m.group(1) if id_m else ""

            # Label text
            lbl_m = re.search(r"<label[^>]*class=[\x27\"][^\x27\"]*ays_position_initial[^\x27\"]*[\x27\"][^>]*>(.*?)</label>", f_html, re.DOTALL)
            ans_text = ""
            if lbl_m:
                raw_ans = re.sub(r"<[^>]+>", " ", lbl_m.group(1))
                ans_text = html.unescape(raw_ans).strip()
                ans_text = re.sub(r"\s+", " ", ans_text)

            # Option image if any
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

        # Explanation
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

def fetch_batch(batch_idx):
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64)"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return parse_rendered_html(data["content"]["rendered"])

def main():
    print(f"Starting collector for DevOps questions (target: {TARGET_TOTAL})...")
    all_questions = {}
    stagnant_batches = 0
    batch_count = 0
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=5) as executor:
        while len(all_questions) < TARGET_TOTAL and stagnant_batches < 25:
            # Dispatch 5 requests at a time
            futures = [executor.submit(fetch_batch, batch_count + i) for i in range(5)]
            batch_count += 5

            new_in_round = 0
            for fut in as_completed(futures):
                try:
                    q_batch = fut.result()
                    for qid, q_data in q_batch.items():
                        if qid not in all_questions:
                            all_questions[qid] = q_data
                            new_in_round += 1
                except Exception as e:
                    print(f"Batch request error: {e}", file=sys.stderr)

            if new_in_round > 0:
                stagnant_batches = 0
            else:
                stagnant_batches += 1

            elapsed = time.time() - start_time
            print(f"Progress: {len(all_questions)}/{TARGET_TOTAL} questions collected (batches: {batch_count}, elapsed: {elapsed:.1f}s)")
            time.sleep(0.5)

    print(f"\nCollection finished in {time.time() - start_time:.1f}s.")
    print(f"Total unique questions collected: {len(all_questions)}")

    # Sort questions by ID
    sorted_questions = sorted(all_questions.values(), key=lambda x: x["id"])

    # Output structure
    output_data = {
        "source": "https://widum.ru/s21/devops/",
        "title": "Школа 21. Экзамен DevOps (теория)",
        "total_questions": len(sorted_questions),
        "target_count": TARGET_TOTAL,
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "questions": sorted_questions
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(sorted_questions)} questions to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
