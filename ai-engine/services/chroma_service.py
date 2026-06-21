import hashlib

import chromadb

from config import (
    CHROMA_DB_PATH,
    CHROMA_COLLECTION
)

from services.embedding_service import (
    generate_embedding
)

client = chromadb.PersistentClient(
    path=CHROMA_DB_PATH
)

collection = client.get_or_create_collection(
    name=CHROMA_COLLECTION
)


def generate_chunk_id(chunk):

    return hashlib.md5(
        chunk.encode(
            "utf-8",
            errors="ignore"
        )
    ).hexdigest()


def store_chunks(chunks):

    stored_count = 0

    for chunk in chunks:

        try:

            chunk_id = generate_chunk_id(
                chunk
            )

            existing = collection.get(
                ids=[chunk_id]
            )

            if existing["ids"]:

                continue

            embedding = generate_embedding(
                chunk
            )

            collection.add(
                ids=[chunk_id],
                documents=[chunk],
                embeddings=[embedding]
            )

            stored_count += 1

        except Exception as e:

            print(
                f"Chroma Store Error: {e}"
            )

    print(
        f"\nStored {stored_count} new chunks in ChromaDB"
    )


def retrieve_chunks(
    query,
    n_results=5
):

    try:

        embedding = generate_embedding(
            query
        )

        results = collection.query(
            query_embeddings=[
                embedding
            ],
            n_results=n_results
        )

        documents = results.get(
            "documents",
            []
        )

        if not documents:

            return []

        return documents[0]

    except Exception as e:

        print(
            f"Chroma Retrieval Error: {e}"
        )

        return []


def get_collection_count():

    try:

        count = collection.count()

        print(
            f"Chroma Documents: {count}"
        )

        return count

    except Exception as e:

        print(
            f"Count Error: {e}"
        )

        return 0