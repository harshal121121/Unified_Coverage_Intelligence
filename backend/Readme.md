# Unified Code Coverage Dashboard

## Overview

The Unified Code Coverage Dashboard is an AI-powered analytics platform developed to aggregate, analyze, and visualize code quality and test coverage across Java and C++ projects.

The system combines:

* JaCoCo coverage reports (Java)
* gcovr coverage reports (C++)
* SonarCloud quality metrics
* GitHub source code integration
* Ollama-powered AI issue analysis

into a single dashboard that enables developers and managers to understand coverage, quality, security, and risk in one place.

---

# Architecture

GitHub Repository
|
v
Jenkins Pipeline
|
+---- JaCoCo (Java)
|
+---- gcovr (C++)
|
+---- SonarCloud Analysis
|
+---- Coverage Parser
|
v
Unified JSON Report
|
v
POST /api/builds/upload
|
v
Spring Boot Backend
|
v
PostgreSQL Database
|
v
React Dashboard

---

# Technology Stack

## Backend

* Java 21
* Spring Boot 3
* Spring Data JPA
* PostgreSQL
* Jackson
* Maven

## Frontend

* React
* TypeScript
* Vite
* Material UI

## DevOps

* Jenkins
* GitHub
* SonarCloud

## Coverage Tools

### Java

* JaCoCo

### C++

* gcovr
* gcov

## AI

* Ollama
* LLM-based Issue Analysis

---

# Project Workflow

## Step 1: Code Commit

Developer pushes code to GitHub.

## Step 2: Jenkins Build

Jenkins triggers:

* Java build
* C++ build
* Unit tests

## Step 3: Coverage Generation

### Java

JaCoCo generates:

target/site/jacoco/jacoco.xml

### C++

gcovr generates:

coverage.xml

coverage.json

## Step 4: SonarCloud Analysis

SonarCloud provides:

* Bugs
* Vulnerabilities
* Code Smells
* Security Hotspots
* Technical Debt
* Ratings

## Step 5: Coverage Parser

Parser combines:

* JaCoCo XML
* gcovr XML
* Sonar metrics

into a single Unified Coverage Report JSON.

## Step 6: Upload

POST

/api/builds/upload

stores all information into PostgreSQL.

---

# Database Schema

## builds

Stores build metadata.

Fields:

* id
* build_number
* status
* commit_id
* author
* start_time
* end_time

---

## repositories

Stores repository information.

Fields:

* id
* url
* branch

---

## coverage_summary

Stores overall coverage.

Fields:

* overall_line_coverage
* overall_branch_coverage
* java_coverage
* cpp_coverage

---

## module_coverage

Stores module level coverage.

Fields:

* module_name
* module_path
* language
* line_coverage
* branch_coverage
* risk_level

---

## sonar_metrics

Stores Sonar summary metrics.

Fields:

* bugs
* vulnerabilities
* code_smells
* security_hotspots
* technical_debt_minutes
* critical_issues
* major_issues
* minor_issues

---

## sonar_issues

Stores Sonar issue details.

Fields:

* issue_key
* rule
* severity
* type
* file_path
* line_number

---

## ai_risk_analysis

Stores AI-generated executive insights.

Fields:

* id
* build_id
* analysis_json
* created_at

---

## ollama_issue_analysis

Stores AI-generated issue recommendations.

Fields:

* issue_key
* rule_key
* severity
* issue_type
* file_path
* line_number
* root_cause
* exact_fix
* suggested_code
* estimated_impact

---

# GitHub Integration

The system fetches source files directly from GitHub.

Flow:

Module ID
|
v
Module Path
|
v
GitHub API
|
v
Source Code
|
+ Coverage Data
|
v
Highlighted Source Viewer

Coverage colors:

* Green = Covered
* Yellow = Partially Covered
* Red = Not Covered

---

# SonarCloud Integration

Metrics Collected:

* Bugs
* Vulnerabilities
* Code Smells
* Security Hotspots
* Technical Debt
* Reliability Rating
* Security Rating
* Maintainability Rating

Endpoints:

GET /api/dashboard/sonar-summary

GET /api/dashboard/sonar-issues

GET /api/dashboard/sonar-issues/{issueKey}

---

# AI Insights

AI-generated executive analysis includes:

* Executive Summary
* Coverage Risk Analysis
* Code Quality Analysis
* Security Analysis

Endpoint:

GET /api/dashboard/ai-insights

POST /api/dashboard/ai-insights

---

# AI Issue Analysis

Ollama generates:

* Root Cause
* Exact Fix
* Suggested Code
* Estimated Impact

Endpoints:

GET /api/dashboard/ollama-issues

GET /api/dashboard/ollama-issues/{issueKey}

POST /api/builds/ollama-analysis

---

# Module Source Viewer

Endpoint:

GET /api/dashboard/modules/{id}/source

Features:

* Live GitHub source retrieval
* Coverage highlighting
* Line-level analysis

Coverage Status:

COVERED

PARTIAL

NOT_COVERED

---

# Dashboard APIs

## Summary

GET /api/dashboard/summary

## Modules

GET /api/dashboard/modules

GET /api/dashboard/modules/{id}

GET /api/dashboard/modules/{id}/source

## Coverage Trend

GET /api/dashboard/coverage-trend

## Build History

GET /api/dashboard/build-history

## Sonar

GET /api/dashboard/sonar-summary

GET /api/dashboard/sonar-issues

GET /api/dashboard/sonar-issues/{issueKey}

## AI

GET /api/dashboard/ai-insights

POST /api/dashboard/ai-insights

GET /api/dashboard/ollama-issues

GET /api/dashboard/ollama-issues/{issueKey}

## Risk

GET /api/dashboard/risk-rating

---

# Running the Project

## Backend

mvn clean install

mvn spring-boot:run

Runs on:

http://localhost:8000

## Frontend

npm install

npm run dev

Runs on:

http://localhost:5173

---

# Future Enhancements

* Multi-repository support
* Historical AI trend analysis
* Automated fix generation
* Pull Request annotations
* Coverage heatmaps
* Risk prediction models
* CI/CD quality gates

---



