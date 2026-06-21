from sentence_transformers import (
    SentenceTransformer
)

model = None


def get_embedding_model():

    global model

    if model is None:

        print(
            "\nLoading Embedding Model..."
        )

        model = SentenceTransformer(

            "all-MiniLM-L6-v2"

        )

        print(
            "Embedding Model Loaded"
        )

    return model


def generate_embedding(text):

    embedding_model = (
        get_embedding_model()
    )

    return embedding_model.encode(

        text,

        show_progress_bar=False

    ).tolist()