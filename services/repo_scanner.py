import os

from services.hash_service import (
    generate_file_hash,
    load_hash_cache,
    save_hash_cache
)

SUPPORTED_EXTENSIONS = [
    ".java",
    ".cpp",
    ".py",
    ".js"
]


def scan_changed_files(repo_path):

    changed_files = []

    existing_cache = load_hash_cache()

    updated_cache = existing_cache.copy()

    first_run = len(existing_cache) == 0

    for root, dirs, files in os.walk(repo_path):

        for file in files:

            if not file.endswith(
                tuple(SUPPORTED_EXTENSIONS)
            ):
                continue

            filepath = os.path.join(
                root,
                file
            )

            try:

                current_hash = generate_file_hash(
                    filepath
                )

                should_process = (

                    first_run

                    or existing_cache.get(
                        filepath
                    ) != current_hash

                )

                if should_process:

                    with open(
                        filepath,
                        "r",
                        encoding="utf-8",
                        errors="ignore"
                    ) as f:

                        changed_files.append({

                            "path": filepath,

                            "content": f.read(),

                            "hash": current_hash
                        })

                updated_cache[
                    filepath
                ] = current_hash

            except Exception as e:

                print(
                    f"Error scanning {filepath}: {e}"
                )

    save_hash_cache(
        updated_cache
    )

    print(
        f"\nChanged Files Found: "
        f"{len(changed_files)}"
    )

    return changed_files


def scan_all_files(repo_path):

    all_files = []

    for root, dirs, files in os.walk(repo_path):

        for file in files:

            if not file.endswith(
                tuple(SUPPORTED_EXTENSIONS)
            ):
                continue

            filepath = os.path.join(
                root,
                file
            )

            try:

                with open(
                    filepath,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:

                    all_files.append({

                        "path": filepath,

                        "content": f.read()
                    })

            except Exception as e:

                print(
                    f"Error reading {filepath}: {e}"
                )

    print(
        f"\nTotal Files Found: "
        f"{len(all_files)}"
    )

    return all_files