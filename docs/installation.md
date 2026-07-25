# Installation Guide

## Prerequisites
- Node.js 20+
- Python 3.11+
- Git

## Quickstart

```bash
# 1. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# 2. Frontend Setup (in separate terminal)
cd frontend
npm install
npm run dev
```
