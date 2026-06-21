from services.repo_scanner import (
    scan_changed_files
)

from engine.chunking_engine import (
    chunk_text
)

from services.chroma_service import (
    store_chunks
)


def build_repo_context(repo_path):

    files = scan_changed_files(
        repo_path
    )

    print(
        f"\nFiles Found: {len(files)}"
    )

    all_chunks = []

    for file in files:

        content = file.get(
            "content",
            ""
        )

        if not content.strip():
            continue

        chunks = chunk_text(
            content
        )

        all_chunks.extend(
            chunks
        )

    print(
        f"Chunks Generated: {len(all_chunks)}"
    )

    if all_chunks:

        store_chunks(
            all_chunks
        )

    print(
        f"\nStored {len(all_chunks)} optimized chunks"
    )

    return files