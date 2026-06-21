def build_remediation_prompt(issue, code_context):

    return f"""
You are a Senior Software Architect.

Analyze issue.

Issue Type:
{issue['type']}

Rule:
{issue['ruleDescription']}

Message:
{issue['message']}

File:
{issue['file']}

Line:
{issue['line']}

Code:

{code_context}

Return ONLY JSON.

Schema:

{{
 "rootCause":"",
 "exactFix":"",
 "suggestedCode":"",
 "estimatedImpact":""
}}

Rules:

1. Give exact developer action.
2. No generic advice.
3. If possible provide code snippet.
4. Keep response concise.
"""