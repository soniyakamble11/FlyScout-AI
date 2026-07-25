from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.core.constants import API_V1_STR
from app.core.exceptions import BaseFlyScoutException
from app.middleware.request_logger import RequestLoggerMiddleware
from app.middleware.error_handler import global_exception_handler
from app.logging.logger import logger
from app.routers import (
    health,
    campaigns,
    pipeline,
    companies,
    contacts,
    research,
    emails,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="FlyScout AI — Production-grade Outbound BDR Multi-Agent Platform API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggerMiddleware)

# ── EXCEPTION HANDLERS ────────────────────────────────────────────────────────
# CRITICAL: Register RequestValidationError BEFORE the generic Exception handler.
# Without this, FastAPI's 422 errors are eaten by global_exception_handler and
# returned as 500, masking the real schema mismatch from the frontend.
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    errors = exc.errors()
    logger.warning(f"[422] Validation error on {request.url.path}: {errors}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request body validation failed.",
                "details": errors,
            },
        },
    )

app.add_exception_handler(BaseFlyScoutException, global_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# ── ROUTERS ───────────────────────────────────────────────────────────────────
app.include_router(health.router, prefix=API_V1_STR)
app.include_router(campaigns.router, prefix=API_V1_STR)
app.include_router(pipeline.router, prefix=API_V1_STR)
app.include_router(companies.router, prefix=API_V1_STR)
app.include_router(contacts.router, prefix=API_V1_STR)
app.include_router(research.router, prefix=API_V1_STR)
app.include_router(emails.router, prefix=API_V1_STR)


@app.get("/", summary="Root Endpoint")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api_v1": API_V1_STR,
        "tavily_configured": bool(settings.TAVILY_API_KEY),
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "hunter_configured": bool(settings.HUNTER_API_KEY),
    }


@app.on_event("startup")
async def startup_event():
    logger.info("=" * 60)
    logger.info(f"  {settings.APP_NAME} v{settings.APP_VERSION} starting up")
    logger.info(f"  Environment : {settings.ENVIRONMENT}")
    logger.info(f"  TAVILY key  : {'[OK] loaded' if settings.TAVILY_API_KEY else '[MISSING]'}")
    logger.info(f"  GEMINI key  : {'[OK] loaded' if settings.GEMINI_API_KEY else '[MISSING]'}")
    logger.info(f"  HUNTER key  : {'[OK] loaded' if settings.HUNTER_API_KEY else 'not set (fallback active)'}")
    logger.info(f"  CORS origins: {settings.ALLOWED_ORIGINS}")
    logger.info("=" * 60)
