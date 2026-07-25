from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class StorageService(ABC):

    @abstractmethod
    async def save(self, collection: str, data_id: str, record: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    async def get(self, collection: str, data_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def list_all(self, collection: str) -> List[Dict[str, Any]]:
        pass