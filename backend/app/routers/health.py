from fastapi import APIRouter
from app.utils.helpers import format_success_response, get_utc_now_iso
from app.config.settings import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", summary="Service Health Check")
async def health_check():
    """Returns application operational status and version metadata."""
    return format_success_response(
        data={
            "app_name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
            "status": "healthy",
            "timestamp": get_utc_now_iso()
        },
        message="System operational"
    )
