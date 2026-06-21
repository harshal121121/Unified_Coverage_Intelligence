"""
json_parser.py

Utilities for loading coverage reports and safely parsing LLM JSON responses.
"""

import json
import re
import os
from config import COVERAGE_REPORT_PATH


# ── Coverage Report ────────────────────────────────────────────────────────────

def load_report() -> dict:
    if not os.path.exists(COVERAGE_REPORT_PATH):
        raise FileNotFoundError(
            f"Coverage report not found: {COVERAGE_REPORT_PATH}"
        )
    with open(COVERAGE_REPORT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# ── LLM Response Parsing ───────────────────────────────────────────────────────

def safe_parse_json(raw: str) -> dict:
    """
    Safely parse a JSON string that may be wrapped in markdown fences
    or contain leading/trailing noise from the LLM.

    Returns a dict on success, or an empty dict on failure.
    """
    if not raw or not isinstance(raw, str):
        return {}

    # Strip markdown fences
    cleaned = re.sub(r"```(?:json)?", "", raw).strip()
    cleaned = cleaned.strip("`").strip()

    # Find the first {...} block
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Last attempt: replace smart quotes
        cleaned = cleaned.replace("\u201c", '"').replace("\u201d", '"')
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {}