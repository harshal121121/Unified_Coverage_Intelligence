import json
import os

CACHE_FILE = "cache/complexity_cache.json"


def load_complexity_cache():

    if not os.path.exists(CACHE_FILE):
        return {}

    try:

        with open(
            CACHE_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    except (
        json.JSONDecodeError,
        FileNotFoundError,
        OSError
    ):

        return {}


def save_complexity_cache(cache):

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
            cache,
            f,
            indent=4,
            ensure_ascii=False
        )