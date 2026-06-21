import json
import hashlib

from prompts.executive_prompt import (
    build_executive_prompt
)

from engine.retrieval_engine import (
    get_relevant_context
)

from services.llm_service import (
    generate_llm_response
)

from services.executive_cache_service import (
    load_executive_cache,
    save_executive_cache
)


def generate_ai_analysis(summary):

    cache = load_executive_cache()

    current_hash = hashlib.md5(
        json.dumps(
            summary,
            sort_keys=True
        ).encode()
    ).hexdigest()

    if cache.get("hash") == current_hash:

        print("\nUsing Executive Cache")

        return cache.get("data", {})

    # ====================================
    # BUILD RETRIEVAL QUERY
    # ====================================

    retrieval_query = f"""
    Project Languages:
    {summary.get('languages', [])}

    Overall Coverage:
    {summary.get('overallCoverage', 0)}

    Overall Line Coverage:
    {summary.get('overallLineCoverage', 0)}

    Overall Branch Coverage:
    {summary.get('overallBranchCoverage', 0)}

    Java Coverage:
    {summary.get('javaCoverage', 0)}

    Java Branch Coverage:
    {summary.get('javaBranchCoverage', 0)}

    C++ Coverage:
    {summary.get('cppCoverage', 0)}

    C++ Branch Coverage:
    {summary.get('cppBranchCoverage', 0)}

    Bugs:
    {summary.get('bugs', 0)}

    Vulnerabilities:
    {summary.get('vulnerabilities', 0)}

    Code Smells:
    {summary.get('codeSmells', 0)}

    Security Hotspots:
    {summary.get('securityHotspots', 0)}

    Critical Issues:
    {summary.get('criticalIssues', 0)}

    Major Issues:
    {summary.get('majorIssues', 0)}

    Minor Issues:
    {summary.get('minorIssues', 0)}

    Technical Debt Minutes:
    {summary.get('technicalDebtMinutes', 0)}

    Security Rating:
    {summary.get('securityRating', '')}

    Reliability Rating:
    {summary.get('reliabilityRating', '')}

    Maintainability Rating:
    {summary.get('maintainabilityRating', '')}

    Quality Gate:
    {summary.get('qualityGate', '')}
    """

    repo_context = get_relevant_context(
        retrieval_query
    )

    print(
        f"\nRetrieved Context Length: "
        f"{len(repo_context)}"
    )

    # ====================================
    # BUILD PROMPT
    # ====================================

    prompt = build_executive_prompt(
        summary,
        repo_context
    )

    # ====================================
    # GENERATE AI RESPONSE
    # ====================================

    ai_response = generate_llm_response(
        prompt
    )

    print("\nRAW AI RESPONSE:\n")

    print(ai_response)

    # Save raw response

    with open(
        "executive_raw_response.txt",
        "w",
        encoding="utf-8"
    ) as f:

        f.write(ai_response)

    # ====================================
    # PARSE JSON
    # ====================================

    try:

        cleaned_response = ai_response.strip()

        if cleaned_response.startswith(
            "```json"
        ):

            cleaned_response = (
                cleaned_response
                .replace(
                    "```json",
                    ""
                )
                .replace(
                    "```",
                    ""
                )
                .strip()
            )

        elif cleaned_response.startswith(
            "```"
        ):

            cleaned_response = (
                cleaned_response
                .replace(
                    "```",
                    ""
                )
                .strip()
            )

        parsed = json.loads(
            cleaned_response
        )

    except Exception as e:

        print(
            f"\nExecutive Analysis JSON Parse Error: {e}"
        )

        print(
            "\nRAW AI RESPONSE:\n"
        )

        print(ai_response)

        parsed = {}
    # ====================================
    # VALIDATE / FIX OUTPUT
    # ====================================

    parsed.setdefault(
        "executiveSummary",
        "Executive summary unavailable."
    )

    parsed.setdefault(
        "coverageRiskInsight",
        "Coverage insight unavailable."
    )

    parsed.setdefault(
        "codeQualityInsight",
        "Code quality insight unavailable."
    )

    parsed.setdefault(
        "securityInsight",
        "Security insight unavailable."
    )

        # ====================================
    # FINAL RESULT
    # ====================================

    result = {

        "executiveSummary":

            parsed.get(
                "executiveSummary",
                "Executive summary unavailable."
            ),

        "coverageRiskInsight":

            parsed.get(
                "coverageRiskInsight",
                "Coverage insight unavailable."
            ),

        "codeQualityInsight":

            parsed.get(
                "codeQualityInsight",
                "Code quality insight unavailable."
            ),

        "securityInsight":

            parsed.get(
                "securityInsight",
                "Security insight unavailable."
            )

    }

    # ====================================
    # SAVE CACHE
    # ====================================

    save_executive_cache({

        "hash":

            current_hash,

        "data":

            result

    })

    return result