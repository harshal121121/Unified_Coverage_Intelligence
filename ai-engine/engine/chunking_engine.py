def chunk_text(
    text,
    chunk_size=800
):

    if not text:
        return []

    chunks = []

    text_length = len(text)

    for i in range(
        0,
        text_length,
        chunk_size
    ):

        chunk = text[
            i:i + chunk_size
        ].strip()

        if chunk:

            chunks.append(
                chunk
            )

    return chunks