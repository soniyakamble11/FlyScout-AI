from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import httpx
from app.config.settings import settings
from app.logging.logger import logger


class SearchService(ABC):
    """Abstract interface for web search providers."""

    @abstractmethod
    async def search(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        pass


class TavilySearchService(SearchService):
    """
    SearchService using Tavily AI Search API.
    Returns empty list on failure — agents mark signals as ungrounded rather than hallucinating.
    """

    def __init__(self):
        self.api_key = settings.TAVILY_API_KEY
        self.base_url = "https://api.tavily.com/search"

    async def search(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        if not self.api_key:
            logger.warning(f"[Tavily] TAVILY_API_KEY not set — returning empty results for '{query}'")
            return []

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(
                    self.base_url,
                    json={
                        "api_key": self.api_key,
                        "query": query,
                        "max_results": max_results,
                        "include_answer": True,
                        "search_depth": "advanced",
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    results = data.get("results", [])
                    logger.info(f"[Tavily] '{query}' -> {len(results)} results")
                    return [
                        {
                            "title": r.get("title", ""),
                            "url": r.get("url", ""),
                            "content": r.get("content", ""),
                            "score": r.get("score", 0.5),
                        }
                        for r in results
                    ]
                else:
                    logger.warning(f"[Tavily] HTTP {resp.status_code} for query '{query}': {resp.text[:200]}")
        except Exception as e:
            logger.error(f"[Tavily] Exception for '{query}': {e}")

        return []

    async def extract(self, urls: List[str]) -> List[Dict[str, Any]]:
        return [{"url": url, "raw_content": ""} for url in urls]
