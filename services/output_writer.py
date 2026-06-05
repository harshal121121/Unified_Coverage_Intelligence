import json
import os


OUTPUT_DIR = "output"


def create_output_directory():

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )


def save_executive_output(data):

    create_output_directory()

    executive_schema = {

        "executiveSummary": data.get(
            "executiveSummary",
            ""
        ),

        "coverageRiskInsight": data.get(
            "coverageRiskInsight",
            ""
        ),

        "codeQualityInsight": data.get(
            "codeQualityInsight",
            ""
        ),

        "securityInsight": data.get(
            "securityInsight",
            ""
        ),

        "recommendations": data.get(
            "recommendations",
            []
        )
    }

    with open(

        os.path.join(
            OUTPUT_DIR,
            "executive_analysis.json"
        ),

        "w",

        encoding="utf-8"

    ) as f:

        json.dump(

            executive_schema,

            f,

            indent=4,

            ensure_ascii=False
        )

    print(
        "\nExecutive analysis saved successfully"
    )


def save_complexity_output(data):

    create_output_directory()

    complexity_schema = {

        "totalFiles": data.get(
            "totalFiles",
            0
        ),

        "results": data.get(
            "results",
            []
        )
    }

    with open(

        os.path.join(
            OUTPUT_DIR,
            "complexity_analysis.json"
        ),

        "w",

        encoding="utf-8"

    ) as f:

        json.dump(

            complexity_schema,

            f,

            indent=4,

            ensure_ascii=False
        )

    print(
        "\nComplexity analysis saved successfully"
    )


def load_executive_output():

    filepath = os.path.join(

        OUTPUT_DIR,

        "executive_analysis.json"
    )

    if not os.path.exists(filepath):

        return {}

    with open(

        filepath,

        "r",

        encoding="utf-8"

    ) as f:

        return json.load(f)


def load_complexity_output():

    filepath = os.path.join(

        OUTPUT_DIR,

        "complexity_analysis.json"
    )

    if not os.path.exists(filepath):

        return {

            "totalFiles": 0,

            "results": []
        }

    with open(

        filepath,

        "r",

        encoding="utf-8"

    ) as f:

        return json.load(f)