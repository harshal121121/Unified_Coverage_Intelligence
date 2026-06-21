# services/complexity_cache_service.py

import os
import json
import hashlib
from typing import Dict, Any


class ComplexityCacheService:

    def __init__(
        self,
        cache_path: str = "cache/complexity_cache.json"
    ):

        self.cache_path = cache_path

        self.cache = self._load_cache()

    # =====================================================
    # LOAD CACHE
    # =====================================================

    def _load_cache(self) -> Dict[str, Any]:

        if (
            not os.path.exists(self.cache_path)
            or
            os.path.getsize(self.cache_path) == 0
        ):

            return {}

        try:

            with open(
                self.cache_path,
                "r",
                encoding="utf-8"
            ) as f:

                loaded = json.load(f)

                if not isinstance(
                    loaded,
                    dict
                ):
                    return {}

                return loaded

        except Exception as e:

            print(
                f"\n[-] Complexity Cache Load Error: {e}"
            )

            return {}

    # =====================================================
    # GENERATE METHOD HASH
    # =====================================================

    def generate_cache_key(
        self,
        filepath: str,
        method_name: str,
        method_code: str
    ) -> str:

        compound_key = (

            f"{filepath}||"

            f"{method_name}||"

            f"{method_code}"
        )

        return hashlib.sha256(

            compound_key.encode("utf-8")

        ).hexdigest()

    # =====================================================
    # GET CACHE
    # =====================================================

    def get_cached_result(
        self,
        cache_key: str
    ) -> Dict[str, Any]:

        return self.cache.get(
            cache_key
        )

    # =====================================================
    # UPDATE METHOD CACHE
    # =====================================================

    def update_method_cache(

        self,

        cache_key,

        filepath,

        filename,

        language,

        method_name,

        method_code,

        ai_response
    ) -> None:

        self.cache[cache_key]={

            "filepath":filepath,

            "filename":filename,

            "language":language,

            "methodName":method_name,

            "payload":ai_response
        }

        self.save_cache()

    # =====================================================
    # REMOVE STALE METHODS
    # =====================================================

    def remove_deleted_methods(

        self,

        active_cache_keys

    ) -> None:

        self.cache = {

            key: value

            for key, value in self.cache.items()

            if key in active_cache_keys
        }

        self.save_cache()

    # =====================================================
    # RETURN COMPLETE CACHE
    # =====================================================

    def get_all_results(self):

        return {

            "cachedMethods": len(self.cache)
    }

    # =====================================================
    # SAVE CACHE
    # =====================================================

    def save_cache(self):

        try:

            os.makedirs(

                os.path.dirname(
                    self.cache_path
                ),

                exist_ok=True
            )

            temp_file = (

                f"{self.cache_path}.tmp"
            )

            with open(

                temp_file,

                "w",

                encoding="utf-8"

            ) as f:

                json.dump(

                    self.cache,

                    f,

                    indent=4,

                    ensure_ascii=False
                )

            if os.path.exists(
                self.cache_path
            ):

                os.remove(
                    self.cache_path
                )

            os.rename(

                temp_file,

                self.cache_path
            )

        except Exception as e:

            print(

                f"\n[-] Complexity Cache Save Error: "

                f"{e}"
            )