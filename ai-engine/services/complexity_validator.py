# services/complexity_validator.py

import re
from typing import Dict, Any, Tuple


VALID_COMPLEXITIES = {
    "O(1)",
    "O(log N)",
    "O(logn)",
    "O(N)",
    "O(n)",
    "O(N log N)",
    "O(n log n)",
    "O(N²)",
    "O(n²)",
    "O(N^2)",
    "O(n^2)",
    "O(N³)",
    "O(n³)",
    "O(N^3)",
    "O(n^3)",
    "O(2^N)",
    "O(2^n)",
    "O(N!)",
    "O(n!)"
}


class ComplexityValidator:

    @staticmethod
    def validate(response: Dict[str, Any]) -> Tuple[bool, str]:

        if not isinstance(response, dict):
            return False, "Response is not a JSON object."

        required_fields = [
            "methodName",
            "language",
            "currentTimeComplexity",
            "reasoning",
            "suggestion",
            "suggestedCodeTemplate",
            "estimatedImpact"
        ]

        for field in required_fields:

            if field not in response:
                return False, f"Missing field: {field}"

        # ---------------------------------
        # Normalize Strings
        # ---------------------------------

        for key in required_fields:

            if response[key] is None:
                response[key] = ""

            if isinstance(response[key], str):
                response[key] = response[key].strip()

        # ---------------------------------
        # Method Name
        # ---------------------------------

        if len(response["methodName"]) == 0:
            return False, "Method name is empty."

        # ---------------------------------
        # Language
        # ---------------------------------

        if response["language"] not in [
            "Java",
            "C++"
        ]:
            return False, "Invalid language."

        # ---------------------------------
        # Complexity
        # ---------------------------------

        tc = response["currentTimeComplexity"]

        if len(tc) == 0:
            return False, "Time complexity is empty."

        if tc not in VALID_COMPLEXITIES:
            return False, f"Unsupported complexity: {tc}"

        # ---------------------------------
        # Reasoning
        # ---------------------------------

        reasoning = response["reasoning"]

        if len(reasoning) < 40:
            return False, "Reasoning too short."

        if "```" in reasoning:
            return False, "Markdown detected."

        # ---------------------------------
        # Suggestion
        # ---------------------------------

        suggestion = response["suggestion"]

        if len(suggestion) < 20:
            return False, "Suggestion too short."

        # ---------------------------------
        # Estimated Impact
        # ---------------------------------

        impact = response["estimatedImpact"]

        if len(impact) < 10:
            return False, "Estimated impact missing."

        # ---------------------------------
        # Suggested Code Validation
        # ---------------------------------

        if tc != "O(1)":

            if response["suggestedCodeTemplate"] == "":
                return False, "Missing suggested code."

        # ---------------------------------
        # Reject LLM Placeholder Responses
        # ---------------------------------

        bad_phrases = [

            "lorem ipsum",

            "not enough information",

            "cannot determine",

            "unable to determine",

            "unknown complexity",

            "n/a"
        ]

        full_text = (
            reasoning +
            suggestion +
            impact
        ).lower()

        for phrase in bad_phrases:

            if phrase in full_text:
                return False, f"Invalid AI response: {phrase}"

        return True, "Valid response."