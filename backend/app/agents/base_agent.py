from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from app.core.enums import AgentStatus

class BaseAgent(ABC):
    """
    Abstract Base Agent Interface.
    All specialized AI agents (ICP, Company, Contact, Research, Personalization, Email)
    must inherit from this interface and implement all lifecycle methods.
    """
    def __init__(self, name: str):
        self.name: str = name
        self._status: AgentStatus = AgentStatus.IDLE

    @abstractmethod
    async def initialize(self, context: Dict[str, Any]) -> None:
        """Initialize agent resources, parameters, and input context."""
        pass

    @abstractmethod
    async def validate(self, input_data: Dict[str, Any]) -> bool:
        """Validate input payload against agent requirements before execution."""
        pass

    @abstractmethod
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute core agent task logic and return structured result dictionary."""
        pass

    @abstractmethod
    async def cleanup(self) -> None:
        """Clean up transient resources, client connections, or temporary state."""
        pass

    @abstractmethod
    def health(self) -> Dict[str, Any]:
        """Return operational health status and API dependency state."""
        pass

    @abstractmethod
    def status(self) -> AgentStatus:
        """Return current execution status of the agent."""
        pass
