import requests

from config import (

    MODEL_NAME,

    OLLAMA_URL
)


def generate_llm_response(prompt):

    payload = {

        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }

    response = requests.post(

        OLLAMA_URL,

        json=payload,

        timeout=1800
    )

    return response.json().get(

        "response",

        ""
    )