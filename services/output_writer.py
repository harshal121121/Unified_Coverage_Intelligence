# services/output_writer.py

import os
import json
from typing import Dict, Any

OUTPUT_DIR = "output"

def create_output_directory():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_executive_output(data):
    create_output_directory()
    executive_schema = {
        "executiveSummary": data.get("executiveSummary", ""),
        "coverageRiskInsight": data.get("coverageRiskInsight", ""),
        "codeQualityInsight": data.get("codeQualityInsight", ""),
        "securityInsight": data.get("securityInsight", "")
    }
    with open(os.path.join(OUTPUT_DIR, "executive_analysis.json"), "w", encoding="utf-8") as f:
        json.dump(executive_schema, f, indent=4, ensure_ascii=False)
    print("\nExecutive analysis saved successfully")

def load_executive_output():
    filepath = os.path.join(OUTPUT_DIR, "executive_analysis.json")
    if not os.path.exists(filepath):
        return {}
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

_create_output_directory = create_output_directory

def save_complexity_output(data: dict) -> None:

    create_output_directory()

    with open(
        os.path.join(
            OUTPUT_DIR,
            "complexity_analysis.json"
        ),
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            indent=4,
            ensure_ascii=False
        )

    print(
        "\nComplexity analysis saved successfully"
    )

def load_complexity_output() -> dict:
    return _read_json(
        "complexity_analysis.json",
        default={"totalMethods": 0, "highComplexityMethods": 0, "methods": []}
    )

def _write_json(filename: str, data) -> None:
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def _read_json(filename: str, default):
    path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[READ ERROR] {path}: {e}")
        return default

def save_bug_output(data):
    create_output_directory()
    with open(os.path.join(OUTPUT_DIR, "bug_analysis.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("\nBug analysis saved successfully")


# =====================================================================
# TIME COMPLEXITY ENGINE WRITER ADDITION (HIERARCHICAL RESTRUCTURE)
# =====================================================================
class OutputWriterService:

    def __init__(
        self,
        output_path: str = "output/complexity_output.json"
    ):
        self.output_path = output_path

    def write_final_report(
        self,
        processed_cache: Dict[str, Any]
    ) -> Dict[str, Any]:

        total_methods = 0

        methods_output = []

        for _, cache_item in processed_cache.items():

            payload = cache_item.get(
                "payload",
                {}
            )

            if not payload:
                continue

            total_methods += 1

            methods_output.append({

                "fileName":

                    cache_item.get(
                        "filename",
                        ""
                    ),

                "language":

                    payload.get(
                        "language",
                        ""
                    ),

                "methodName":

                    payload.get(
                        "methodName",
                        ""
                    ),

                "currentTimeComplexity":

                    payload.get(
                        "currentTimeComplexity",
                        ""
                    ),

                "reasoning":

                    payload.get(
                        "reasoning",
                        ""
                    ),

                "suggestedCodeTemplate":

                    payload.get(
                        "suggestedCodeTemplate",
                        ""
                    ),

                "estimatedImpact":

                    payload.get(
                        "estimatedImpact",
                        ""
                    )
            })

        final_output = {

            "totalMethods":

                total_methods,

            "methods":

                methods_output
        }

        try:

            os.makedirs(

                os.path.dirname(
                    self.output_path
                ),

                exist_ok=True
            )

            with open(

                self.output_path,

                "w",

                encoding="utf-8"

            ) as f:

                json.dump(

                    final_output,

                    f,

                    indent=4,

                    ensure_ascii=False
                )

        except Exception as e:

            print(

                f"[-] Complexity Output Error: "

                f"{e}"
            )

        return final_output