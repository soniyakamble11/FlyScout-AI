import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
from app.logging.logger import logger

class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """
    Middleware for attaching unique Request IDs, logging incoming requests, and measuring execution time.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start_time = time.time()

        logger.info(f"Incoming Request [{request.method}] {request.url.path} (ID: {request_id})")

        response = await call_next(request)
        execution_time = (time.time() - start_time) * 1000

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Execution-Time-MS"] = f"{execution_time:.2f}"

        logger.info(
            f"Response [{response.status_code}] {request.url.path} - {execution_time:.2f}ms (ID: {request_id})"
        )
        return response
