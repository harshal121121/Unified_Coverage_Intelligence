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

    repo_context = get_relevant_context(
        str(summary)
    )

    print(
        f"\nRetrieved Context Length: "
        f"{len(repo_context)}"
    )

    prompt = build_executive_prompt(
        summary,
        repo_context
    )

    ai_response = generate_llm_response(
        prompt
    )
    print("\nRAW AI RESPONSE:")
    print(ai_response)

    try:

        parsed = json.loads(
            ai_response
        )

        required_fields = [
            "executiveSummary",
            "coverageRiskInsight",
            "codeQualityInsight",
            "securityInsight",
            "recommendations"
        ]

        for field in required_fields:

            if field not in parsed:

                raise ValueError(
                    f"Missing field: {field}"
                )

        if not isinstance(
            parsed["recommendations"],
            list
        ):
            raise ValueError(
                "recommendations must be a list"
            )

    except Exception as e:

        print(
            f"Executive Analysis JSON Parse Error: {e}"
        )

        print(
            "\nRAW AI RESPONSE:\n"
        )

        print(ai_response)

        parsed = {}

    result = {

        "executiveSummary": parsed.get(
            "executiveSummary",
            ""
        ),

        "coverageRiskInsight": parsed.get(
            "coverageRiskInsight",
            ""
        ),

        "codeQualityInsight": parsed.get(
            "codeQualityInsight",
            ""
        ),

        "securityInsight": parsed.get(
            "securityInsight",
            ""
        ),

        "recommendations": parsed.get(
            "recommendations",
            []
        )
    }

    save_executive_cache({
        "hash": current_hash,
        "data": result
    })

    return result