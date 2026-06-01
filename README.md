# CodeSensei – AI Code Reviewer

CodeSensei is an agentic AI-powered code review platform designed to act like an experienced software engineer reviewing your code. Instead of waiting for a teammate or manually debugging issues, developers can receive instant feedback on bugs, security concerns, performance problems, and code quality issues.

The goal is to provide developers with meaningful and actionable code reviews while building a foundation for repository-level analysis, GitHub integration, security scanning, and automated pull request reviews.

## Current Features (Implemented)

### Code Review via Code Paste

Developers can paste source code directly into the frontend and receive AI-generated reviews.

<img width="661" height="475" alt="image" src="https://github.com/user-attachments/assets/91f3e5f9-05d3-42a4-824e-04bce9a0306a" />

The system:

* Detects issues in the submitted code
* Identifies bugs and potential runtime errors
* Highlights security concerns
* Suggests performance improvements
* Provides code quality recommendations
* Returns structured JSON responses for frontend rendering

### Multi-File Analysis

Developers can upload multiple source files together.

The backend:

* Parses all uploaded files
* Detects programming language automatically
* Reviews each file independently
* Returns structured reviews per file

### ZIP Repository Analysis

Developers can upload an entire project as a ZIP archive.

The system:

* Extracts the repository
* Recursively scans source files
* Ignores unnecessary folders such as:

  * node_modules
  * .git
  * **pycache**
  * venv
* Detects supported programming languages
* Reviews each source file individually
* Generates an aggregated repository summary

### Repository Summary Generation

For uploaded repositories, CodeSensei generates repository-level metrics:

* Total Bugs Found
* Security Issues
* Performance Issues
* High Severity Findings

This provides an overview of repository health before inspecting individual file reviews.

### AI Review Engine

The review engine currently uses:

* Groq API
* Llama 3.1 8B Instant

Reviews are returned in structured JSON format and cleaned before being sent to the frontend.

### Frontend Integration

Frontend integration for manual code review is working.

Users can:

1. Paste code into the frontend.
2. Submit for review.
3. Receive structured AI-generated feedback from the backend.

Backend and frontend communication through the API gateway has been successfully integrated.

---

## Architecture

```text
Frontend
   ↓
Express Gateway
   ↓
FastAPI AI Service
   ↓
Groq LLM
```

### Current Backend Flow

```text
Code/File Upload
       ↓
File Parsing
       ↓
Language Detection
       ↓
AI Review Generation
       ↓
Response Cleaning
       ↓
Repository Summary Generation
       ↓
Structured JSON Response
```

---

## Tech Stack

### Frontend

* React

### API Gateway

* Node.js
* Express

### AI Service

* FastAPI
* Python

### LLM

* Groq
* Llama 3.1 8B Instant

---

## Planned Features

### GitHub Repository Analysis

Review repositories directly from GitHub URLs without ZIP uploads.

### Pull Request Reviews

Automatically review pull requests using GitHub Webhooks.

### Security Intelligence

Integrate CVE databases to detect vulnerable dependencies.

### Static Analysis

Integrate tools such as:

* ESLint
* Pylint
* Bandit
* Semgrep

### RAG-Powered Reviews

Use Retrieval-Augmented Generation to provide:

* Framework-specific best practices
* Internal coding standards
* Team conventions
* Learning resources

### MCP Integration

Leverage Model Context Protocol (MCP) servers to connect with:

* GitHub
* Documentation systems
* Issue trackers
* Knowledge bases

This will enable deeper repository understanding and agentic code review workflows.



