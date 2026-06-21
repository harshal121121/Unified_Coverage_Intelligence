import json
import os


CACHE_FILE = "cache/bug_cache.json"


def load_bug_cache():

    if not os.path.exists(CACHE_FILE):

        return {}

    with open(
        CACHE_FILE,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


def save_bug_cache(data):

    os.makedirs(
        "cache",
        exist_ok=True
    )

    with open(
        CACHE_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            indent=4,
            ensure_ascii=False
        )