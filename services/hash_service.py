import hashlib
import json
import os

from config import HASH_CACHE


def generate_file_hash(filepath):

    with open(filepath, "rb") as f:

        return hashlib.md5(
            f.read()
        ).hexdigest()


def load_hash_cache():

    if not os.path.exists(HASH_CACHE):

        return {}

    if os.path.getsize(HASH_CACHE) == 0:

        return {}

    try:

        with open(HASH_CACHE, "r") as f:

            return json.load(f)

    except:

        return {}


def save_hash_cache(cache):

    os.makedirs(

        "cache",

        exist_ok=True
    )

    with open(HASH_CACHE, "w") as f:

        json.dump(

            cache,

            f,

            indent=4
        )