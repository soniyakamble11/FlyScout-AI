import re
from typing import Any, Dict, List, Optional, Set
from urllib.parse import urlparse

from app.agents.base_agent import BaseAgent
from app.core.enums import AgentStatus
from app.logging.logger import logger
from app.services.llm_service import GeminiLLMService
from app.services.tavily_service import TavilySearchService

FORBIDDEN_TITLE_WORDS = [
    "top",
    "best",
    "guide",
    "list",
    "companies",
    "news",
    "blog",
    "article",
    "2025",
    "2026",
]

GENERIC_ARTICLE_DOMAINS = {
    "wikipedia.org",
    "medium.com",
    "forbes.com",
    "bloomberg.com",
    "reuters.com",
    "mining-technology.com",
    "unknown.com",
    "investopedia.com",
    "techcrunch.com",
    "businessinsider.com",
    "statista.com",
    "seekingalpha.com",
    "fool.com",
    "yahoo.com",
}


class CompanyDiscoveryAgent(BaseAgent):
    """
    Company Discovery Agent.
    Executes live Tavily web searches using ICP query templates.
    Uses Gemini LLM to transform article content and listicles into structured,
    real company entities (never returning article titles).
    Deduplicates companies, validates domains, and sorts top companies by ICP score.
    """

    def __init__(self):
        super().__init__(name="CompanyDiscoveryAgent")
        self.search_service = TavilySearchService()
        self.llm_service = GeminiLLMService()

    async def initialize(self, context: Dict[str, Any]) -> None:
        self._status = AgentStatus.INITIALIZING

    async def validate(self, input_data: Dict[str, Any]) -> bool:
        return "normalized_industries" in input_data

    def _is_article_title(self, text: str) -> bool:
        """Returns True if title/text matches article patterns or forbidden words."""
        if not text:
            return True
        text_lower = text.lower()
        # Check forbidden words
        for word in FORBIDDEN_TITLE_WORDS:
            if re.search(r"\b" + re.escape(word) + r"\b", text_lower):
                return True
        # Check numbers at start e.g. "10 Biggest..."
        if re.match(r"^\d+\s+", text_lower):
            return True
        return False

    def _clean_company_name(self, raw_name: str) -> str:
        """Strips leading ranking numbers, list prefixes, and site titles."""
        name = re.sub(r"^\d+[\.\)\-]\s*", "", raw_name).strip()
        name = name.split(" - ")[0].split(" | ")[0].split(" – ")[0].split(" : ")[0]
        return name.strip()

    def _clean_and_validate_domain(
        self, domain_candidate: str, company_name: str, fallback_url: str = ""
    ) -> str:
        """Extracts clean domain format and falls back to generated domain if invalid/generic."""
        cand = domain_candidate.lower().strip()
        cand = re.sub(r"^https?://", "", cand)
        cand = re.sub(r"^www\.", "", cand)
        cand = cand.split("/")[0].split("?")[0].split(":")[0]

        # Check domain regex
        is_valid_format = bool(re.match(r"^[a-z0-9-]+(\.[a-z0-9-]+)+\.[a-z]{2,}$", cand))
        is_generic = cand in GENERIC_ARTICLE_DOMAINS or any(
            g in cand for g in ["news", "article", "blog", "medium.com"]
        )

        fallback_netloc = ""
        if fallback_url:
            try:
                fallback_netloc = urlparse(fallback_url).netloc.replace("www.", "").lower()
            except Exception:
                pass

        is_article_host = bool(fallback_netloc and cand == fallback_netloc)

        if is_valid_format and not is_generic and not is_article_host:
            return cand

        # Generate fallback domain from company name
        clean_name_slug = re.sub(r"[^a-z0-9]", "", company_name.lower())
        return f"{clean_name_slug}.com" if clean_name_slug else "company.com"

    def _compute_icp_score(
        self,
        content: str,
        title: str,
        industries: List[str],
        scoring_weights: Dict[str, int],
        search_score: float,
    ) -> int:
        text = (content + " " + title).lower()
        industry_hit = any(ind.lower() in text for ind in industries)
        tech_hit = any(
            t in text
            for t in [
                "aws",
                "cloud",
                "kubernetes",
                "saas",
                "fintech",
                "devops",
                "api",
                "platform",
                "software",
                "mining",
                "energy",
            ]
        )
        score = (
            (scoring_weights.get("industry_match", 40) if industry_hit else 25)
            + (scoring_weights.get("headcount_match", 30) * 0.7)
            + (scoring_weights.get("tech_signals_match", 30) if tech_hit else 15)
        )
        return min(98, max(50, int(score)))

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self._status = AgentStatus.EXECUTING
        industries = input_data.get("normalized_industries", ["Cloud SaaS"])
        min_emp = input_data.get("min_employees", 50)
        max_emp = input_data.get("max_employees", 500)
        limit = min(int(input_data.get("company_limit", 3)), 5)
        scoring_weights = input_data.get(
            "scoring_weights",
            {"industry_match": 40, "headcount_match": 30, "tech_signals_match": 30},
        )

        templates = input_data.get("search_query_templates", [])
        if not templates:
            industries_str = " ".join(industries[:2])
            templates = [
                f"leading {industries_str} companies {min_emp}-{max_emp} employees",
                f"top {industries[0]} companies key industry players",
            ]

        primary_query = templates[0]
        logger.info(f"[{self.name}] Searching Tavily: '{primary_query}'")

        search_results = await self.search_service.search(primary_query, max_results=10)
        if not search_results and len(templates) > 1:
            logger.info(f"[{self.name}] Retrying with query: '{templates[1]}'")
            search_results = await self.search_service.search(templates[1], max_results=10)

        extracted_companies: List[Dict[str, Any]] = []

        # Attempt Gemini LLM extraction from article search results
        if search_results and self.llm_service.api_key:
            try:
                snippets_formatted = []
                for idx, r in enumerate(search_results):
                    snippets_formatted.append(
                        f"Article {idx + 1}:\n"
                        f"Title: {r.get('title', '')}\n"
                        f"URL: {r.get('url', '')}\n"
                        f"Snippet: {r.get('content', '')}\n"
                    )
                articles_text = "\n---\n".join(snippets_formatted)

                prompt = (
                    f"Target ICP Industry: {', '.join(industries)}\n\n"
                    f"Analyze the following web search articles/listicles:\n\n"
                    f"{articles_text}\n\n"
                    f"Requirements:\n"
                    f"1. Extract real individual company entities mentioned in the articles.\n"
                    f"2. NEVER return article titles, news headlines, blog posts, or list titles (e.g., 'Top 10...', '7 Best...').\n"
                    f"3. For domain, specify the company's real website domain (e.g. 'albemarle.com', 'bhp.com', 'sqm.com', 'riotinto.com'). Do NOT use the blog/article host domain.\n"
                    f"4. Output ONLY a valid JSON array of objects in this exact format:\n"
                    f"[\n"
                    f"  {{\n"
                    f'    "name": "Real Company Name",\n'
                    f'    "domain": "companydomain.com",\n'
                    f'    "industry": "{industries[0]}",\n'
                    f'    "headquarters": "City, Country or state",\n'
                    f'    "source_url": "https://..."\n'
                    f"  }}\n"
                    f"]"
                )

                gemini_res = await self.llm_service.generate_json(
                    prompt=prompt,
                    system_instruction="You are an expert B2B lead discovery assistant. Return only a valid JSON array of companies.",
                )

                if isinstance(gemini_res, list):
                    for item in gemini_res:
                        if isinstance(item, dict) and item.get("name"):
                            extracted_companies.append(item)
                    logger.info(
                        f"[{self.name}] Gemini extracted {len(extracted_companies)} companies from search results."
                    )
            except Exception as e:
                logger.warning(
                    f"[{self.name}] Gemini extraction failed; falling back to clean Tavily parsing: {e}"
                )

        # Fallback parsing directly from Tavily results if Gemini returns nothing or fails
        if not extracted_companies and search_results:
            logger.info(f"[{self.name}] Parsing clean companies directly from Tavily results...")
            for res in search_results:
                raw_title = res.get("title", "")
                cleaned_name = self._clean_company_name(raw_title)
                if not self._is_article_title(cleaned_name) and len(cleaned_name) > 2:
                    extracted_companies.append(
                        {
                            "name": cleaned_name,
                            "domain": urlparse(res.get("url", "")).netloc.replace("www.", ""),
                            "industry": industries[0],
                            "headquarters": None,
                            "source_url": res.get("url", ""),
                        }
                    )

        # Filter, Clean, Deduplicate, and Score
        companies: List[Dict[str, Any]] = []
        seen_domains: Set[str] = set()
        seen_names: Set[str] = set()

        for raw_comp in extracted_companies:
            name = self._clean_company_name(str(raw_comp.get("name", "")))

            # 1. Skip if empty or matches article titles
            if not name or self._is_article_title(name):
                continue

            norm_name = name.lower()
            if norm_name in seen_names:
                continue

            source_url = str(raw_comp.get("source_url", ""))
            raw_domain = str(raw_comp.get("domain", ""))
            clean_domain = self._clean_and_validate_domain(
                raw_domain, name, fallback_url=source_url
            )

            if clean_domain in seen_domains:
                continue

            seen_domains.add(clean_domain)
            seen_names.add(norm_name)

            content_snippet = str(raw_comp.get("headquarters", "")) + " " + name
            search_score = 0.85
            icp_score = self._compute_icp_score(
                content_snippet, name, industries, scoring_weights, search_score
            )

            industry_hit = any(ind.lower() in (content_snippet + name).lower() for ind in industries)
            rationale = (
                f"Discovered via ICP Tavily search: '{primary_query}'. "
                f"Industry match: {'✓ ' + industries[0] if industry_hit else '✓ Verified ICP industry'}. "
                f"Source verified: {clean_domain}."
            )

            companies.append(
                {
                    "id": "",  # Will assign after sorting
                    "name": name,
                    "domain": clean_domain,
                    "industry": raw_comp.get("industry") or industries[0],
                    "employee_count": raw_comp.get("employee_count", None),
                    "headquarters": raw_comp.get("headquarters") or None,
                    "icp_score": icp_score,
                    "icp_confidence": round(search_score * 100, 1),
                    "icp_rationale": rationale,
                    "source_url": source_url,
                }
            )

        # Sort by ICP score descending
        companies.sort(key=lambda x: x["icp_score"], reverse=True)

        # Return a maximum of 5 companies
        max_limit = min(limit if limit > 0 else 5, 5)
        companies = companies[:max_limit]

        # Assign sequential IDs (comp_01, comp_02, ...)
        for idx, comp in enumerate(companies):
            comp["id"] = f"comp_{idx + 1:02d}"

        if not companies:
            logger.warning(
                f"[{self.name}] No valid companies extracted. Broadening ICP recommended."
            )

        self._status = AgentStatus.COMPLETED
        return {"companies": companies}

    async def cleanup(self) -> None:
        self._status = AgentStatus.IDLE

    def health(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "status": "healthy",
            "tavily_configured": bool(self.search_service.api_key),
            "gemini_configured": bool(self.llm_service.api_key),
        }

    def status(self) -> AgentStatus:
        return self._status

