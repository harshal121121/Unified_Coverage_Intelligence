import os

from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = os.getenv("MODEL_NAME")

OLLAMA_URL = os.getenv("OLLAMA_URL")

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH")

CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION")

# API_URL = os.getenv("API_URL")

JAVA_REPO_URL = os.getenv("JAVA_REPO_URL")

CPP_REPO_URL = os.getenv("CPP_REPO_URL")

HASH_CACHE = "cache/file_hashes.json"

EXECUTIVE_API_URL = "http://10.33.7.113:8000/api/dashboard/ai-insights"

COMPLEXITY_UPLOAD_API = "http://10.33.7.113:8000/api/complexity/upload"

COMPLEXITY_RESULTS_API = "http://10.33.7.113:8000/api/complexity/results"