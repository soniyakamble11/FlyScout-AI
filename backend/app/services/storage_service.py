from typing import Any, Dict, List, Optional

from app.services.base_storage import StorageService


class InMemoryStorageService(StorageService):
    """
    In-memory storage implementation.
    """

    def __init__(self):
        self._collections: Dict[str, Dict[str, Dict[str, Any]]] = {}

    async def save(self, collection: str, data_id: str, record: Dict[str, Any]) -> bool:
        if collection not in self._collections:
            self._collections[collection] = {}

        self._collections[collection][data_id] = record
        return True

    async def get(self, collection: str, data_id: str) -> Optional[Dict[str, Any]]:
        return self._collections.get(collection, {}).get(data_id)

    async def list_all(self, collection: str) -> List[Dict[str, Any]]:
        return list(self._collections.get(collection, {}).values())


storage_instance = InMemoryStorageService()