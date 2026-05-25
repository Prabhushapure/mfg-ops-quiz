"""Convert MFG Shopfloor Quiz docx files to game JSON question banks."""
from __future__ import annotations

import importlib.util
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

_shuffle_spec = importlib.util.spec_from_file_location(
    "shuffle_quiz_options",
    Path(__file__).resolve().parent / "shuffle-quiz-options.py",
)
_shuffle_mod = importlib.util.module_from_spec(_shuffle_spec)
_shuffle_spec.loader.exec_module(_shuffle_mod)
shuffle_question = _shuffle_mod.shuffle_question

DOWNLOADS = Path(r"C:\Users\hi\Downloads\MFG Shopfloor Quiz")
OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "data"

W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

TOPICS = [
    {
        "slug": "lean-manufacturing-shopfloor-productivity",
        "file": "MFG Quiz - Lean Manufacturing & Shopfloor Productivity.docx",
        "label": "Lean Manufacturing & Shopfloor Productivity",
        "parser": "structured",
    },
    {
        "slug": "machine-operations-maintenance-awareness",
        "file": "MFG Quiz - Machine Operations & Maintenance Awareness.docx",
        "label": "Machine Operations & Maintenance Awareness",
        "parser": "structured",
    },
    {
        "slug": "production-operations-materials-flow",
        "file": "MFG Quiz - Production Operations & Materials Flow.docx",
        "label": "Production Operations & Materials Flow",
        "parser": "structured",
    },
    {
        "slug": "quality-control-defect-prevention",
        "file": "MFG Quiz - Quality Control & Defect Prevention.docx",
        "label": "Quality Control & Defect Prevention",
        "parser": "structured",
    },
    {
        "slug": "shopfloor-safety-industrial-ehs",
        "file": "MFG Quiz - Shopfloor Safety & Inductrial EHS.docx",
        "label": "Shopfloor Safety & Industrial EHS",
        "parser": "dot_options",
    },
]


def read_docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as zf:
        xml = zf.read("word/document.xml")
    root = ET.fromstring(xml)
    parts: list[str] = []
    for node in root.iter(f"{W_NS}t"):
        if node.text:
            parts.append(node.text)
        if node.tail:
            parts.append(node.tail)
    return "".join(parts)


def letter_from_answer(text: str) -> str | None:
    m = re.match(r"^([A-D])\)", text.strip())
    if m:
        return m.group(1)
    m = re.match(r"^([A-D])\.", text.strip())
    if m:
        return m.group(1)
    return None


def parse_structured(text: str, topic_label: str, slug: str) -> list[dict]:
    # Strip title prefix before first numbered question
    text = re.sub(r"^.*?(?=\d+\.\s)", "", text, count=1, flags=re.DOTALL)
    blocks = re.split(r"(?=\d+\.\s)", text)
    questions: list[dict] = []
    qnum = 0

    for block in blocks:
        block = block.strip()
        if not block:
            continue
        m = re.match(r"(\d+)\.\s*(.+?)(?=Options:)", block, re.DOTALL)
        if not m:
            continue
        qnum += 1
        question = re.sub(r"\s+", " ", m.group(2).strip())

        opts_match = re.search(
            r"Options:\s*(.+?)(?=Answer:)",
            block,
            re.DOTALL,
        )
        if not opts_match:
            continue
        opts_text = opts_match.group(1)
        option_lines = re.findall(
            r"([A-D])\)\s*(.+?)(?=[A-D]\)|Answer:|$)",
            opts_text,
            re.DOTALL,
        )
        if len(option_lines) < 4:
            continue

        ans_match = re.search(r"Answer:\s*([A-D])\)\s*(.+?)(?=Explanation:|$)", block, re.DOTALL)
        if not ans_match:
            ans_match = re.search(r"Answer:\s*([A-D])\)", block)
        if not ans_match:
            continue
        correct = ans_match.group(1)

        expl_match = re.search(r"Explanation:\s*(.+?)(?=\d+\.\s|$)", block, re.DOTALL)
        explanation = ""
        if expl_match:
            explanation = re.sub(r"\s+", " ", expl_match.group(1).strip())
            explanation = re.sub(r"Calculation:.*", "", explanation).strip()

        options = [
            f"{letter}. {re.sub(r'\\s+', ' ', opt.strip())}"
            for letter, opt in option_lines[:4]
        ]

        questions.append(
            {
                "id": f"{slug}-q{qnum}",
                "question": question,
                "options": options,
                "correctAnswer": correct,
                "explanation": explanation or f"The correct answer is {correct}.",
                "topic": topic_label,
            }
        )

    return questions


def parse_dot_options(text: str, topic_label: str, slug: str) -> list[dict]:
    text = re.sub(r"^.*?(?=\d+\.\s)", "", text, count=1, flags=re.DOTALL)
    blocks = re.split(r"(?=\d+\.\s)", text)
    questions: list[dict] = []
    qnum = 0

    for block in blocks:
        block = block.strip()
        if not block:
            continue
        m = re.match(r"(\d+)\.\s*(.+?)(?=A\.\s)", block, re.DOTALL)
        if not m:
            continue
        qnum += 1
        question = re.sub(r"\s+", " ", m.group(2).strip())

        opts_match = re.search(r"(A\.\s.+?)(?=Answer:)", block, re.DOTALL)
        if not opts_match:
            continue
        option_lines = re.findall(
            r"([A-D])\.\s*(.+?)(?=[A-D]\.|Answer:|$)",
            opts_match.group(1),
            re.DOTALL,
        )
        if len(option_lines) < 4:
            continue

        ans_match = re.search(
            r"Answer:\s*([A-D])\)\s*(.+?)(?=Explanation:|$)",
            block,
            re.DOTALL,
        )
        if not ans_match:
            ans_match = re.search(r"Answer:\s*([A-D])\)", block)
        if not ans_match:
            continue
        correct = ans_match.group(1)

        expl_match = re.search(r"Explanation:\s*(.+?)(?=\d+\.\s|$)", block, re.DOTALL)
        explanation = ""
        if expl_match:
            explanation = re.sub(r"\s+", " ", expl_match.group(1).strip())

        options = [
            f"{letter}. {re.sub(r'\\s+', ' ', opt.strip())}"
            for letter, opt in option_lines[:4]
        ]

        questions.append(
            {
                "id": f"{slug}-q{qnum}",
                "question": question,
                "options": options,
                "correctAnswer": correct,
                "explanation": explanation or f"The correct answer is {correct}.",
                "topic": topic_label,
            }
        )

    return questions


def parse_mcq(text: str, topic_label: str, slug: str) -> list[dict]:
    # Remove table of contents / header
    text = re.sub(
        r"^.*?Chapter 1",
        "Chapter 1",
        text,
        count=1,
        flags=re.DOTALL,
    )
    chapters = re.split(r"(?=Chapter \d+)", text)
    questions: list[dict] = []
    qnum = 0

    for chapter in chapters:
        if not chapter.strip():
            continue
        ch_match = re.match(r"Chapter \d+\s*[–-]\s*(.+?)(?=\d+\.)", chapter)
        subtopic = ch_match.group(1).strip() if ch_match else topic_label
        body = re.sub(r"^Chapter \d+\s*[–-]\s*.+?(?=\d+\.)", "", chapter, count=1, flags=re.DOTALL)

        for block in re.split(r"(?=\d+\.\s)", body):
            block = block.strip()
            if not block:
                continue
            m = re.match(
                r"(\d+)\.\s*(.+?)(?=[A-D]\.\s)",
                block,
                re.DOTALL,
            )
            if not m:
                continue

            rest = block[m.end() :]
            opts = re.findall(
                r"([A-D])\.\s*(.+?)(?=[A-D]\.\s|✅|$)",
                rest,
                re.DOTALL,
            )
            if len(opts) < 4:
                continue

            ans = re.search(r"✅\s*Answer:\s*([A-D])", block)
            if not ans:
                continue

            qnum += 1
            question = re.sub(r"\s+", " ", m.group(2).strip())
            correct = ans.group(1)
            options = [
                f"{letter}. {re.sub(r'\\s+', ' ', opt.strip())}"
                for letter, opt in opts[:4]
            ]

            questions.append(
                {
                    "id": f"{slug}-q{qnum}",
                    "question": question,
                    "options": options,
                    "correctAnswer": correct,
                    "explanation": f"The correct answer is {correct}.",
                    "topic": subtopic,
                }
            )

    return questions


def parse_topic_questions(topic: dict) -> list[dict]:
    slug = topic["slug"]
    label = topic["label"]
    questions: list[dict] = []

    if "sources" in topic:
        for source in topic["sources"]:
            path = DOWNLOADS / source["file"]
            text = read_docx_text(path)
            if source["parser"] == "mcq":
                questions.extend(parse_mcq(text, label, slug))
            else:
                questions.extend(parse_structured(text, label, slug))
        return questions

    path = DOWNLOADS / topic["file"]
    text = read_docx_text(path)
    parser = topic["parser"]
    if parser == "mcq":
        return parse_mcq(text, label, slug)
    if parser == "dot_options":
        return parse_dot_options(text, label, slug)
    return parse_structured(text, label, slug)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    summary: list[str] = []

    for topic in TOPICS:
        questions = parse_topic_questions(topic)
        slug = topic["slug"]
        label = topic["label"]

        for i, q in enumerate(questions):
            q["id"] = f"{slug}-q{i + 1}"
            q["topic"] = label
            shuffle_question(q, i)

        out_path = OUT_DIR / f"{slug}-questions.json"
        out_path.write_text(
            json.dumps(questions, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        summary.append(f"{slug}: {len(questions)} questions -> {out_path.name}")

    print("\n".join(summary))


if __name__ == "__main__":
    main()
