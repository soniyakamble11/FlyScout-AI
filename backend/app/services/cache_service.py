from abc import ABC, abstractmethod
from typing import Any, Optional

class CacheService(ABC):
    """
    Abstract Interface for In-Memory or Distributed Cache Service.
    """
    @abstractmethod
    async def get(self, key: str) -> Optional[Any]:
        """Retrieve value from cache by key."""
        pass

    @abstractmethod
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Store key-value pair in cache with optional TTL."""
        pass

    @abstractmethod
    async def delete(self, key: str) -> bool:
        """Remove key from cache."""
        pass
