import uuid
from datetime import datetime, timezone
from typing import Any, Dict

def generate_uuid(prefix: str = "") -> str:
    """
    Generate a formatted unique identifier with optional prefix.
    """
    uid = str(uuid.uuid4()).replace("-", "")[:12]
    return f"{prefix}_{uid}" if prefix else uid

def get_utc_now_iso() -> str:
    """
    Get current UTC timestamp formatted as ISO 8601 string.
    """
    return datetime.now(timezone.utc).isoformat()

def format_success_response(data: Any, message: str = "Operation completed successfully") -> Dict[str, Any]:
    """
    Format standard API success JSON structure.
    """
    return {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": get_utc_now_iso()
    }
