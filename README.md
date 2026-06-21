# Unified Coverage Intelligence

An AI-powered enterprise platform for **code coverage analysis**, **static code quality assessment**, and **intelligent software insights** across Java and C++ projects.

The platform combines coverage metrics, SonarCloud analysis, AI-driven bug remediation, executive insights, and method-level time complexity analysis into a unified dashboard.

---

## Project Modules

```text
Unified_Coverage_Intelligence/
│
├── backend/          # Spring Boot REST APIs
├── frontend/         # React Dashboard
├── ai_engine/        # AI Analysis Engine
├── Jenkinsfile       # CI/CD Pipeline
└── README.md
```

---

# Architecture

```text
                        GitHub Repository
                               │
                               ▼
                      Jenkins CI/CD Pipeline
                               │
       ┌───────────────────────┼────────────────────────┐
       │                       │                        │
       ▼                       ▼                        ▼
 Java Build               C++ Build             SonarCloud Scan
(JaCoCo)                 (gcovr)
       │                       │                        │
       └─────────────── Coverage Aggregation ───────────┘
                               │
                               ▼
                 Unified Coverage Report (JSON)
                               │
                  Upload to Spring Boot Backend
                               │
                               ▼
                     PostgreSQL Database
                               │
                               ▼
                     React Dashboard (Frontend)
                               │
                               ▼
                    AI Engine Trigger (Optional)
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
      Executive AI      Bug Analysis      Time Complexity
             │                 │                  │
             └─────────────────┼──────────────────┘
                               │
                               ▼
                      AI Analysis JSON Reports
                               │
                               ▼
                      REST API Integration
```

---

# Features

### Coverage Analysis

* Java coverage using JaCoCo
* C++ coverage using gcovr
* Unified coverage aggregation
* Module-wise coverage
* Coverage trends
* Coverage heatmaps

### Code Quality

* SonarCloud integration
* Bugs
* Vulnerabilities
* Code Smells
* Security Hotspots
* Technical Debt

### AI Analysis

* Executive Summary
* Coverage Risk Assessment
* Code Quality Insights
* Security Insights
* Bug Root Cause Analysis
* Exact Fix Recommendations
* Suggested Code Templates
* Estimated Impact Analysis
* Method-wise Time Complexity Analysis
* AI Optimization Suggestions

### Dashboard

* Interactive React dashboard
* Build history
* Coverage visualization
* Module source viewer
* AI insights
* Risk analysis

---

# Technology Stack

## Backend

* Java 21
* Spring Boot
* PostgreSQL
* Maven
* Jackson

## Frontend

* React
* TypeScript
* Vite
* Material UI
* Tailwind CSS
* Axios
* Recharts

## AI Engine

* Python
* Ollama (Phi-3)
* ChromaDB
* Sentence Transformers
* Tree-sitter
* GitPython

## DevOps

* Jenkins
* GitHub
* SonarCloud

---

# Project Workflow

```text
Developer
     │
     ▼
Push Code to GitHub
     │
     ▼
Jenkins Pipeline
     │
     ├── Checkout Repository
     ├── Build & Test
     ├── Generate Coverage Reports
     ├── SonarCloud Analysis
     ├── Generate Unified Coverage Report
     ├── Upload Report to Backend
     └── Trigger AI Engine (Optional)
               │
               ▼
        coverage.json
               │
               ▼
        AI Analysis Engine
               │
     ├── Executive Analysis
     ├── Bug Analysis
     └── Time Complexity Analysis
               │
               ▼
      AI Analysis JSON Reports
               │
               ▼
 Spring Boot APIs + PostgreSQL
               │
               ▼
        React Dashboard
```

---

# Repository Structure

```text
backend/
│
├── Spring Boot REST APIs
├── Coverage Processing
├── PostgreSQL Integration
└── Dashboard Services

frontend/
│
├── React Components
├── Dashboard UI
├── Charts
└── API Integration

ai_engine/
│
├── Executive Analysis
├── Bug Analysis
├── Time Complexity Engine
├── RAG Knowledge Base
├── ChromaDB
├── Prompts
├── Output
└── REST API Clients

Jenkinsfile
│
└── Complete CI/CD Pipeline
```

---

# Running the Project

## Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

## AI Engine

```bash
cd ai_engine

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

---

# CI/CD Pipeline

The Jenkins pipeline performs:

* Repository checkout
* Java and C++ build
* Unit testing
* Coverage generation
* SonarCloud analysis
* Unified coverage report generation
* Dashboard upload
* Optional AI Engine execution (local or remote)

---

# Output

## Coverage Tool

```text
unified_master_report.json
```

## AI Engine

```text
output/
├── executive_analysis.json
├── bug_analysis.json
└── complexity_analysis.json
```

---

# Supported Languages

* Java
* C++

---

# Future Enhancements

* Multi-repository analysis
* Historical AI trends
* AI-generated pull request comments
* Automatic code remediation
* Predictive quality gates
* Multi-language support
* AI-assisted code review

---

