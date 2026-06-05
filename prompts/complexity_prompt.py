def build_complexity_prompt(
    file_name,
    file_path,
    file_hash,
    code
):

    return f"""
You are a Senior Software Performance Engineer.

Analyze the source code and return ONLY valid JSON.

Required JSON:

{{
    "moduleName": "{file_name}",
    "filePath": "{file_path}",
    "timeComplexity": "",
    "reason": "",
    "optimizationSuggestion": "",
    "estimatedImprovedComplexity": "",
    "hash": "{file_hash}"
}}

Rules:

1. Return valid JSON only.
2. No markdown.
3. No explanation outside JSON.
4. Every field is mandatory.
5. Do NOT leave any field empty.
6. reason must explain complexity.
7. optimizationSuggestion must always contain a recommendation.
8. estimatedImprovedComplexity must always contain a Big-O value.
9. All values must be strings.

Code:

{code}
"""