# FlyScout AI - Backend API Foundation

Production-grade FastAPI backend service powering the FlyScout AI Outbound BDR multi-agent platform.

## Architecture
Built with Clean Architecture and SOLID design principles:
- **`app/config/`**: Centralized configuration management using Pydantic Settings.
- **`app/logging/`**: Structured JSON & console logger with Request-ID tracing.
- **`app/middleware/`**: Global exception handler, CORS, execution timing middleware.
- **`app/agents/`**: Abstract `BaseAgent` interface and 7 AI agent scaffolds.
- **`app/services/`**: Abstract interfaces for LLM, Search, Contact, Cache, and Storage providers.
- **`app/routers/`**: `/api/v1/` REST endpoint routing definitions.

## Local Setup

```bash
# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment Setup
cp .env.example .env

# Run FastAPI Server
uvicorn app.main:app --reload --port 8000
```

Access Interactive Swagger Documentation at: `http://localhost:8000/docs`
