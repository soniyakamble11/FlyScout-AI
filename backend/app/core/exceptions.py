from typing import Any, Optional, Dict

class BaseFlyScoutException(Exception):
    """
    Base Exception class for all custom FlyScout AI errors.
    """
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_SERVER_ERROR",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}

class BaseAgentException(BaseFlyScoutException):
    def __init__(self, message: str, agent_name: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=f"Agent '{agent_name}' error: {message}",
            status_code=500,
            error_code="AGENT_EXECUTION_ERROR",
            details=details
        )

class ThirdPartyServiceException(BaseFlyScoutException):
    def __init__(self, service_name: str, message: str, status_code: int = 502):
        super().__init__(
            message=f"Service '{service_name}' failed: {message}",
            status_code=status_code,
            error_code="THIRD_PARTY_SERVICE_ERROR"
        )

class ValidationException(BaseFlyScoutException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="VALIDATION_ERROR",
            details=details
        )

class NotFoundException(BaseFlyScoutException):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(
            message=f"{entity_name} with ID '{entity_id}' not found.",
            status_code=404,
            error_code="RESOURCE_NOT_FOUND"
        )
