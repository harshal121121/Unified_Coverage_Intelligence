def build_executive_prompt(
    report_summary,
    repo_context
):

    return f"""
You are a Senior Software Quality Architect and Engineering Leader.

Analyze the software project using BOTH:

1. Coverage Report
2. Repository Source Code Context

Structured Quality Summary:

{report_summary}

Interpretation Guidance:

• Java coverage above 80% indicates strong testing posture.
• Branch coverage below 50% indicates elevated defect risk.
• Security Rating D or worse indicates immediate attention required.
• Reliability Rating D or worse indicates high production defect exposure.
• Large technical debt values indicate maintainability concerns.
• Critical issues represent near-term engineering priorities.
• Compare Java and C++ repositories independently before forming overall conclusions.

Repository Context:
{repo_context}

Return ONLY valid JSON.

Required Output Format:

{{
    "executiveSummary": "",
    "coverageRiskInsight": "",
    "codeQualityInsight": "",
    "securityInsight": ""
    
}}

STRICT RULES:

1. Output MUST be valid JSON.
2. Use ONLY the data provided.
3. Analyze Java and C++ separately whenever both exist.
4. Compare repository quality characteristics across languages.
5. CoverageRiskInsight MUST discuss BOTH line coverage and branch coverage.
6. Mention Java testing posture.
7. Mention C++ testing posture.
8. SecurityInsight MUST discuss vulnerabilities and security hotspots.
9. If vulnerabilities are present, explain their impact.
10. CodeQualityInsight MUST discuss technical debt and code smells.
11. Mention maintainability concerns.
12. Mention reliability concerns.
13. Mention Quality Gate implications.
14. topRiskAreas must be derived from repository context.
15. Do NOT invent modules not present in context.
16. Do NOT generate recommendations.
17. Do NOT generate fixes.
18. Do NOT focus only on one language.
19. ExecutiveSummary must compare repositories.
20. SecurityInsight must compare repositories if applicable.
21. CoverageRiskInsight must compare repositories if applicable.
22. Every field is mandatory.
23. Return ONLY JSON.
24. Do NOT repeat numeric values already present in the summary.
25. Do NOT mention exact coverage percentages.
26. Do NOT mention bug counts.
27. Do NOT mention vulnerability counts.
28. Do NOT mention code smell counts.
29. Do NOT mention technical debt values.
30. Interpret the implications of the metrics instead of restating them.
31. CoverageRiskInsight should explain the impact of testing posture differences between Java and C++.
32. CodeQualityInsight should discuss maintainability and long-term engineering impact.
33. SecurityInsight should discuss operational and business implications.
34. ExecutiveSummary should provide an overall assessment of release readiness.
35. topRiskAreas must include a reason explaining why the area deserves attention.
36. Use language appropriate for Engineering Managers and Technical Leads.
37. Focus on engineering intelligence rather than metric reporting.

Example Structure:

{{
    "executiveSummary":
    "Management level assessment of software quality, risk exposure, maintainability, testing posture and engineering concerns.",

    "coverageRiskInsight":
    "Coverage analysis, untested areas, branch coverage concerns and testing risks.",

    "codeQualityInsight":
    "Maintainability observations, complexity hotspots, technical debt indicators and architectural concerns.",

    "securityInsight":
    "Security posture, vulnerability exposure, security hotspots and reliability concerns.",


}}

Generate the JSON now.
"""