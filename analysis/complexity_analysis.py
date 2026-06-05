import json
import time

from services.hash_service import (
    generate_file_hash
)

from services.repo_scanner import (
    scan_all_files
)

from services.complexity_cache_service import (
    load_complexity_cache,
    save_complexity_cache
)

from prompts.complexity_prompt import (
    build_complexity_prompt
)

from services.llm_service import (
    generate_llm_response
)

SKIP_SUFFIXES = [
    "Application.java",
    "Config.java",
    "WebConfig.java",
    "CorsConfig.java",
    "SecurityConfig.java"
]


def analyze_complexity(repo_paths):

    cache = load_complexity_cache()

    updated_cache = cache.copy()

    final_results = []

    total_ai_calls = 0

    for repo_path in repo_paths:

        files = scan_all_files(repo_path)

        for file in files:

            filepath = file["path"]

            code = file["content"]

            filename = filepath.replace(
                "\\",
                "/"
            ).split("/")[-1]

            if (
                "test" in filepath.lower()
                or filename.endswith("Test.java")
                or filename.endswith("_test.cpp")
            ):
                continue

            if any(
                filename.endswith(skip)
                for skip in SKIP_SUFFIXES
            ):
                continue

            if len(code.strip()) < 200:
                continue

            current_hash = generate_file_hash(
                filepath
            )

            cached_result = cache.get(
                filepath
            )

            if (
                cached_result
                and cached_result.get("hash")
                == current_hash
            ):

                print(
                    f"Using cached complexity: {filename}"
                )

                result = cached_result

            else:

                total_ai_calls += 1

                print(
                    f"Analyzing complexity: {filename}"
                )

                start_time = time.time()

                prompt = build_complexity_prompt(
                    file_name=filename,
                    file_path=filepath,
                    file_hash=current_hash,
                    code=code[:3000]
                )

                ai_response = generate_llm_response(
                    prompt
                )

                print(
                    f"{filename} processed in "
                    f"{round(time.time() - start_time, 2)} sec"
                )

                try:

                    print(
                        "\nRAW COMPLEXITY RESPONSE:\n"
                    )

                    print(ai_response)

                    result = json.loads(
                        ai_response
                    )

                    required_fields = [
                        "timeComplexity",
                        "reason",
                        "optimizationSuggestion",
                        "estimatedImprovedComplexity"
                    ]

                    for field in required_fields:

                        value = result.get(field)

                        if value is None:

                            raise ValueError(
                                f"Missing field: {field}"
                            )

                        if isinstance(
                            value,
                            str
                        ):

                            value = value.strip()

                            if not value:

                                raise ValueError(
                                    f"Empty field: {field}"
                                )

                        if not isinstance(
                            value,
                            str
                        ):

                            value = json.dumps(
                                value
                            )

                        result[field] = value

                except Exception as e:

                    print(
                        f"Invalid JSON returned for {filename}"
                    )

                    print(e)

                    result = {
                        "moduleName": filename,
                        "filePath": filepath,
                        "timeComplexity": "Unknown",
                        "reason": "Unable to parse AI response",
                        "optimizationSuggestion": "Manual review required",
                        "estimatedImprovedComplexity": "Unknown",
                        "hash": current_hash
                    }

                result["moduleName"] = filename
                result["filePath"] = filepath
                result["hash"] = current_hash

                updated_cache[
                    filepath
                ] = result

            final_results.append({

                "moduleName":
                str(
                    result.get(
                        "moduleName",
                        filename
                    )
                ),

                "filePath":
                str(
                    result.get(
                        "filePath",
                        filepath
                    )
                ),

                "timeComplexity":
                str(
                    result.get(
                        "timeComplexity",
                        "Unknown"
                    )
                ),

                "reason":
                str(
                    result.get(
                        "reason",
                        "Analysis unavailable"
                    )
                ),

                "optimizationSuggestion":
                str(
                    result.get(
                        "optimizationSuggestion",
                        "No suggestion available"
                    )
                ),

                "estimatedImprovedComplexity":
                str(
                    result.get(
                        "estimatedImprovedComplexity",
                        "Unknown"
                    )
                ),

                "hash":
                str(
                    result.get(
                        "hash",
                        current_hash
                    )
                )
            })

    save_complexity_cache(
        updated_cache
    )

    print("\n====================")

    print(
        f"AI Calls Made: {total_ai_calls}"
    )

    print(
        f"Complexity Results: {len(final_results)}"
    )

    print("====================\n")

    return {

        "totalFiles":
        len(final_results),

        "results":
        final_results
    }