# analysis/complexity_analysis.py
import os
import json
import re

from typing import List, Dict, Any

from services.llm_service import (
    generate_llm_response
)

from services.method_extractor_service import (
    MethodExtractorService
)

from services.complexity_cache_service import (
    ComplexityCacheService
)

from services.output_writer import (
    OutputWriterService
)

from prompts.complexity_prompt import (
    get_complexity_prompt
)


def sanitize_and_parse_json(
    raw_response: str
) -> Dict[str, Any]:

    if not raw_response:

        raise ValueError(
            "Empty LLM response."
        )

    cleaned = raw_response.strip()

    cleaned = re.sub(
        r"^```json\s*",
        "",
        cleaned,
        flags=re.IGNORECASE
    )

    cleaned = re.sub(
        r"\s*```$",
        "",
        cleaned
    )

    return json.loads(
        cleaned
    )


def analyze_complexity(
    repo_paths: List[str]
) -> Dict[str, Any]:

    print(
        "\n[+] Starting AI Complexity Analysis..."
    )

    extractor = MethodExtractorService()

    cache_service = ComplexityCacheService()

    writer = OutputWriterService()

    active_cache_keys = set()

    supported_extensions = {

        ".java": "Java",

        ".cpp": "C++",

        ".cc": "C++",

        ".cxx": "C++",

        ".hpp": "C++",

        ".h": "C++"
    }

    for repo_path in repo_paths:

        if not os.path.exists(
            repo_path
        ):

            continue

        print(
            f"\n[+] Processing Repository: "
            f"{repo_path}"
        )

        for root, _, files in os.walk(
            repo_path
        ):

            for file in files:

                filepath = os.path.join(
                    root,
                    file
                )

                ext = os.path.splitext(
                    file
                )[1].lower()

                if ext not in supported_extensions:

                    continue

                if extractor.is_test_file(
                    filepath
                ):

                    continue

                language = supported_extensions[
                    ext
                ]

                methods = extractor.extract_methods(
                    filepath
                )

                for method in methods:

                    cache_key = (

                        cache_service.generate_cache_key(

                            filepath,

                            method["methodName"],

                            method["methodCode"]

                        )
                    )

                    active_cache_keys.add(
                        cache_key
                    )

                    cached_result = (

                        cache_service.get_cached_result(

                            cache_key
                        )
                    )

                    if cached_result:

                        continue

                    print(

                        f"\nAnalyzing Method: "

                        f"{method['methodName']}"
                    )

                    prompt = get_complexity_prompt(

                        method_code=
                            method["methodCode"],

                        language=
                            language,

                        file_name=
                            method["fileName"],

                        method_name=
                            method["methodName"]

                )

                    validated_payload = None

                    for attempt in range(1, 4):

                        try:

                            raw_response = (

                                generate_llm_response(

                                    prompt
                                )
                            )

                            parsed_json = (

                                sanitize_and_parse_json(

                                    raw_response
                                )
                            )
                            
                            for key in parsed_json:

                                if isinstance(parsed_json[key], str):

                                    parsed_json[key] = re.sub(

                                        r"```(?:json)?",

                                        "",

                                        parsed_json[key]

                                    ).strip()
                            
                            print("-" * 60)

                            print(

                                f"Method : {method['methodName']}"

                            )

                            print(

                                f"Time Complexity : "

                                f"{parsed_json.get('currentTimeComplexity','')}"

                            )

                            print("-" * 60)

                            validated_payload = {

                                "methodName": method["methodName"],

                                "language": language,

                                "currentTimeComplexity": parsed_json.get(
                                    "currentTimeComplexity",
                                    ""
                                ),

                                "reasoning": parsed_json.get(
                                    "reasoning",
                                    ""
                                ),

                                "suggestion": parsed_json.get(
                                    "suggestion",
                                    ""
                                ),

                                "suggestedCodeTemplate": parsed_json.get(
                                    "suggestedCodeTemplate",
                                    ""
                                ),

                                "estimatedImpact": parsed_json.get(
                                    "estimatedImpact",
                                    ""
                                )
                            }

                            break

                        except json.JSONDecodeError as e:

                            print(

                                f"Invalid JSON returned by AI : "

                                f"{e}"

                            )

                        except Exception as e:

                            print(

                                f"{e}"

                            )

                    if validated_payload is None:

                        continue

                    cache_service.update_method_cache(

                        cache_key=
                            cache_key,

                        filepath=
                            filepath,

                        filename=
                            file,

                        language=
                            language,

                        method_name=
                            method["methodName"],

                        method_code=
                            method["methodCode"],

                        ai_response=
                            validated_payload
                    )

    cache_service.remove_deleted_methods(

        active_cache_keys
    )

    return writer.write_final_report(

        cache_service.get_all_results()
    )