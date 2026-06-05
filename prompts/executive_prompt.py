def build_executive_prompt(
    report_summary,
    repo_context
):

    return f"""
You are a Senior Software Quality Architect.

Analyze the software project using BOTH:

1. Coverage Report
2. Repository Source Code Context

Coverage Report:
{report_summary}

Repository Context:
{repo_context}

Return ONLY valid JSON.

Required Output Format:

{{
    "executiveSummary": "",
    "coverageRiskInsight": "",
    "codeQualityInsight": "",
    "securityInsight": "",
    "recommendations": [
        "",
        "",
        "",
        "",
        ""
    ]
}}

STRICT RULES:

1. Output MUST be valid JSON.
2. Do NOT return markdown.
3. Do NOT return explanations outside JSON.
4. Do NOT return code blocks.
5. Do NOT leave ANY field empty.
6. Every string field must contain meaningful analysis.
7. recommendations must contain EXACTLY 5 recommendations.
8. recommendations must be strings only.
9. executiveSummary must contain at least 100 words.
10. coverageRiskInsight must contain at least 60 words.
11. codeQualityInsight must contain at least 60 words.
12. securityInsight must contain at least 60 words.
13. Base analysis on BOTH coverage report and repository context.
14. Mention testing risks.
15. Mention maintainability concerns.
16. Mention performance concerns if visible.
17. Mention security concerns if visible.
18. Mention architecture observations if visible.
19. Do NOT invent data not supported by inputs.
20. Every field is mandatory.

Example Structure:

{{
    "executiveSummary": "Detailed management-level project assessment...",
    "coverageRiskInsight": "Coverage analysis and testing risks...",
    "codeQualityInsight": "Code quality, maintainability and architecture analysis...",
    "securityInsight": "Security observations and risks...",
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3",
        "Recommendation 4",
        "Recommendation 5"
    ]
}}

Generate the JSON now.
"""