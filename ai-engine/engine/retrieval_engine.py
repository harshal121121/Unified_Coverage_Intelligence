from services.chroma_service import (
    retrieve_chunks,
    collection
)


def get_relevant_context(
    query,
    max_context_length=4000
):

    try:

        chunks = retrieve_chunks(
            query,
            n_results=5
        )

        if not chunks:

            print(
                "\nNo relevant chunks found in ChromaDB"
            )

            return ""

        context = "\n\n".join(
            chunks
        )

        return context[
            :max_context_length
        ]

    except Exception as e:

        print(
            f"\nRetrieval Error: {e}"
        )

        return ""


def get_total_chunks():

    try:

        return collection.count()

    except:

        return 0