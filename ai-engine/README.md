# AI Engine for Intelligent Code Analysis

An AI-powered code analysis engine that automates software quality assessment using **LLMs**, **RAG**, and **static code analysis**.

## Features

* Executive Analysis
* AI-Based Bug Analysis
* Method-wise Time Complexity Analysis
* AI Optimization Suggestions
* Suggested Code Templates
* ChromaDB-based RAG
* Intelligent Method & Bug Caching
* REST API Integration

---

## Tech Stack

* Python
* Ollama (Phi-3)
* ChromaDB
* Sentence Transformers
* Tree-sitter
* GitPython
* REST APIs

---

## Project Structure

```text
analysis/
engine/
prompts/
services/
repositories/
cache/
chroma_db/
output/
app.py
config.py
requirements.txt
```

---

## Installation

```bash
git clone <repository-url>

cd AI_ENGINE

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

---

## Run

```bash
python app.py
```

---

## Output

The engine generates:

```text
output/
├── executive_analysis.json
├── bug_analysis.json
└── complexity_analysis.json
```

---

## Supported Languages

* Java
* C++

---

## AI Workflow

```text
Coverage Report
        │
        ▼
Clone Repository
        │
        ▼
Build ChromaDB
        │
        ▼
AI Analysis
   ├── Executive
   ├── Bug
   └── Complexity
        │
        ▼
JSON Reports
        │
        ▼
Backend APIs
```