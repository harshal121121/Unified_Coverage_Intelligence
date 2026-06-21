import json
import hashlib



from prompts.bug_prompt import (
    build_bug_prompt
)

from services.llm_service import (
    generate_llm_response
)

from services.bug_cache_service import (
    load_bug_cache,
    save_bug_cache
)

from engine.retrieval_engine import (
    get_total_chunks
)

from services.code_context_service import (
    get_surrounding_code
)


def analyze_issues(report, repo_paths):

    issues = (

        report

        .get("sonar", {})

        .get("issues", [])

    )

    bug_cache = load_bug_cache()

    total_chunks = get_total_chunks()

    print(
        f"\nTotal ChromaDB Chunks: "
        f"{total_chunks}"
    )

    print(
        f"Total Issues To Analyze: "
        f"{len(issues)}"
    )

    results = []

    current_issue_keys = set()

    completed = 0
    ai_calls = 0

    for issue in issues:
        issue_key = issue.get(
            "issueKey"
        )

        current_issue_keys.add(
            issue_key
        )

        issue_hash = hashlib.md5(

            json.dumps(
                issue,
                sort_keys=True
            ).encode()

        ).hexdigest()

        if (

            issue_key in bug_cache

            and

            bug_cache[
                issue_key
            ]["hash"]

            ==

            issue_hash

        ):

            results.append(

                bug_cache[
                    issue_key
                ]["data"]

            )

            completed += 1
        

            print(

                f"Issue "
                f"{completed}/"
                f"{len(issues)} "
                f"(CACHE)"

            )

            continue

        print(
            f"\nAnalyzing Issue: "
            f"{issue.get('issueKey')}"
        )
        
        source_context = ""

        for repo_path in repo_paths:

            source_context = get_surrounding_code(

                repo_path,

                issue.get("file"),

                issue.get("line"),

                context_lines=15

            )

            if (
                "Unable to locate source file"
                not in source_context
            ):
                break

        if (
            "Unable to locate source file"
            in source_context
        ):

            print(
                f"\n[WARNING] Source not found: "
                f"{issue.get('file')}"
            )

            print(
                f"Line: "
                f"{issue.get('line')}"
            )




        code_context = f"""
        ================================================================================
        EXACT SOURCE CODE
        ================================================================================

        {source_context}
        """



        prompt = build_bug_prompt(

            issue,

            code_context

        )

        try:

            ai_response = (

                generate_llm_response(
                    prompt
                )

            )

            issue_result = json.loads(
                ai_response
            )

        except Exception:

            issue_result = {

                "rootCause":

                issue.get(
                    "message",
                    ""
                ),

                "exactFix":

                issue.get(
                    "recommendation",
                    ""
                ),

                "suggestedCode":

                "",

                "estimatedImpact":

                "Unknown"

            }
        final_result = {

            "issueKey":

            issue.get(
                "issueKey"
            ),

            "rule":

            issue.get(
                "rule"
            ),

            "type":

            issue.get(
                "type"
            ),

            "severity":

            issue.get(
                "severity"
            ),

            "file":

            issue.get(
                "file"
            ),

            "line":

            issue.get(
                "line"
            ),

            **issue_result

        }

        results.append(
            final_result
        )
        bug_cache[
            issue_key
        ] = {

            "hash":

            issue_hash,

            "data":

            final_result

        }

        save_bug_cache(
            bug_cache
        )

        completed += 1
        ai_calls += 1

        print(

            f"Issue "
            f"{completed}/"
            f"{len(issues)} "
            f"(AI)"

        )


    # Remove stale issues from cache
    bug_cache = {

        key: value

        for key, value in bug_cache.items()

        if key in current_issue_keys
    }

    save_bug_cache(
        bug_cache
    )

    return {

        "totalIssues":

        len(results),

        "aiCalls":

        ai_calls,

        "issues":

        results

    }