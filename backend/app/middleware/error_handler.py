from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.core.exceptions import BaseFlyScoutException
from app.logging.logger import logger

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global Exception Handler for converting custom & unhandled exceptions into uniform JSON responses.
    """
    request_id = getattr(request.state, "request_id", "N/A")

    if isinstance(exc, BaseFlyScoutException):
        logger.warning(
            f"Handled Exception [{exc.error_code}] {exc.message} - Request ID: {request_id}"
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.error_code,
                    "message": exc.message,
                    "details": exc.details,
                    "request_id": request_id
                }
            }
        )

    logger.error(f"Unhandled Exception: {str(exc)} - Request ID: {request_id}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred.",
                "details": {"raw_error": str(exc)},
                "request_id": request_id
            }
        }
    )
