# FlyScout AI - Outbound BDR Multi-Agent Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Language-Python_3.11-3776AB.svg?style=flat&logo=python)](https://www.python.org/)

FlyScout AI is an enterprise-ready, signal-driven outbound Business Development Representative (BDR) platform powered by a modular mesh of 7 specialized AI agents. Built for the FlytBase Hiring Hackathon.

---

## 🌟 Key Features

1. **Autonomous 7-Agent Mesh Pipeline**:
   - **Planner Agent**: Orchestrates pipeline context and agent step handoffs.
   - **ICP Matching Agent**: Normalizes target filters and generates scoring criteria.
   - **Company Discovery Agent**: Identifies high-fit target B2B accounts via search APIs.
   - **Contact Discovery Agent**: Finds decision-makers with verified work emails.
   - **Research Agent**: Scrapes funding signals, hiring posts, and tech stack changes.
   - **Personalization Agent**: Formulates 2-3 hyper-relevant outreach hooks.
   - **Email Generation Agent**: Crafts 3-step non-generic cold email sequences.
2. **Real-Time Telemetry & Progress Streaming**: Server-Sent Events (SSE) stream agent execution progress and reasoning directly to the React control dashboard.
3. **Anti-Spam Email Reviewer**: Inline editor to review and edit generated 3-touch sequences before exporting to CSV/JSON.
4. **Resilient Architecture**: Centralized Pydantic configuration, structured JSON logging with Request ID tracing, global exception handling, and mock fallback datasets for demo safety.

---

## 📁 Repository Structure

```
FlyScout-AI/
├── backend/                  # FastAPI Python Service
│   ├── app/
│   │   ├── config/           # Pydantic Settings
│   │   ├── agents/           # BaseAgent & 7 specialized AI agent scaffolds
│   │   ├── services/         # Abstract LLM, Search, Contact, Cache, Storage interfaces
│   │   ├── routers/          # REST API router endpoints (/api/v1/)
│   │   ├── schemas/          # Pydantic data contracts
│   │   ├── middleware/       # Request logger & global error handling middleware
│   │   ├── logging/          # Structured JSON logger
│   │   └── main.py           # FastAPI entry point
│   ├── requirements.txt
│   └── .env.example
├── frontend/                 # React + Vite + TypeScript Client
│   ├── src/
│   │   ├── components/       # Glassmorphism UI components & agent status stream
│   │   ├── pages/            # Control center dashboard & campaign views
│   │   ├── services/         # Typed Axios client & SSE listener
│   │   ├── types/            # TypeScript interfaces
│   │   └── index.css         # Glassmorphism design tokens & styles
│   └── package.json
├── shared/                   # Pre-cached fallback data sets for offline safety
│   └── sample_data.json
├── docs/                     # Architecture, Installation & Development guides
├── Docker/                   # Backend & Frontend Dockerfiles
├── .github/workflows/        # CI/CD validation workflow
└── docker-compose.yml        # Container orchestration
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
- Swagger Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Control Dashboard: `http://localhost:5173`

---

## 🐳 Docker Deployment
```bash
docker-compose up --build
```

---

## 📄 License
Created for the FlytBase Hiring Hackathon.
