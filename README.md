# AI Code Quality & Complexity Analysis Engine

AI-powered repository analysis platform using **Phi3 Mini**, **Ollama**, and **ChromaDB**.

## Features

* Executive Analysis
* Complexity Analysis
* Optimization Suggestions
* ChromaDB (RAG)
* Incremental Caching
* Spring Boot API Integration
* React Dashboard Integration

## Tech Stack

* Python
* Ollama
* Phi3 Mini
* ChromaDB
* Spring Boot
* React

## Run

```bash
pip install -r requirements.txt
python app.py
```

## APIs

* POST `/api/dashboard/ai-insights`
* POST `/api/complexity/upload`
* GET `/api/complexity/results`

## Output

* `output/executive_analysis.json`
* `output/complexity_analysis.json`
