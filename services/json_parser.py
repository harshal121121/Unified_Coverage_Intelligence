import json


def load_report():

    with open(

        "data/coverage.json",

        "r"
    ) as f:

        return json.load(f)