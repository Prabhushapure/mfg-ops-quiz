"""Shuffle MCQ option order so correct answers are spread across A–D."""
from __future__ import annotations

import hashlib
import json
import random
import re
from pathlib import Path

LETTERS = "ABCD"
DATA_DIR = Path(__file__).resolve().parent.parent / "src" / "data"
OPTION_PREFIX = re.compile(r"^[A-D]\.\s*")
CORRECT_ANSWER_EXPL = re.compile(r"^The correct answer is [A-D]\.$")


def option_text(opt: str) -> str:
    return OPTION_PREFIX.sub("", opt).strip()


def shuffle_question(question: dict, index: int) -> dict:
    texts = [option_text(o) for o in question["options"]]
    correct_idx = LETTERS.index(question["correctAnswer"])
    correct_text = texts[correct_idx]
    wrong_texts = [t for j, t in enumerate(texts) if j != correct_idx]

    seed = int(hashlib.md5(question["id"].encode()).hexdigest()[:8], 16)
    rng = random.Random(seed)
    rng.shuffle(wrong_texts)

    target_idx = index % 4
    new_texts: list[str | None] = [None, None, None, None]
    new_texts[target_idx] = correct_text
    wi = 0
    for j in range(4):
        if j != target_idx:
            new_texts[j] = wrong_texts[wi]
            wi += 1

    question["options"] = [f"{LETTERS[j]}. {new_texts[j]}" for j in range(4)]
    question["correctAnswer"] = LETTERS[target_idx]

    expl = question.get("explanation", "")
    if CORRECT_ANSWER_EXPL.match(expl):
        question["explanation"] = f"The correct answer is {LETTERS[target_idx]}."

    return question


def shuffle_file(path: Path) -> tuple[int, dict[str, int]]:
    questions = json.loads(path.read_text(encoding="utf-8"))
    for i, q in enumerate(questions):
        shuffle_question(q, i)
    path.write_text(
        json.dumps(questions, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    counts = {letter: 0 for letter in LETTERS}
    for q in questions:
        counts[q["correctAnswer"]] += 1
    return len(questions), counts


def main() -> None:
    for path in sorted(DATA_DIR.glob("*-questions.json")):
        total, counts = shuffle_file(path)
        dist = ", ".join(f"{k}={v}" for k, v in counts.items())
        print(f"{path.name}: {total} questions ({dist})")


if __name__ == "__main__":
    main()
