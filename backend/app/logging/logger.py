import sys
import logging
from datetime import datetime
from typing import Any, Dict
from app.config.settings import settings

class StructuredFormatter(logging.Formatter):
    """
    Custom structured JSON log formatter for production logging.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_object: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "filename": record.filename,
            "line_no": record.lineno,
        }

        if hasattr(record, "request_id"):
            log_object["request_id"] = getattr(record, "request_id")
        if hasattr(record, "execution_time_ms"):
            log_object["execution_time_ms"] = getattr(record, "execution_time_ms")
        if record.exc_info:
            log_object["exception"] = self.formatException(record.exc_info)

        return str(log_object)

def setup_logger(name: str = "flyscout") -> logging.Logger:
    """
    Factory to construct structured, reusable logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))

    if not logger.handlers:
        # Console Handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
        console_format = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s"
        )
        console_handler.setFormatter(console_format)
        logger.addHandler(console_handler)

    return logger

logger = setup_logger()
