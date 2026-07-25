from typing import Any, Dict
from app.agents.base_agent import BaseAgent
from app.core.enums import AgentStatus
from app.logging.logger import logger

class ICPAgent(BaseAgent):
    """
    ICP Matching Agent.
    Normalizes natural language campaign briefs into structured ICP rules,
    scoring weights, and search queries.
    """
    def __init__(self):
        super().__init__(name="ICPMatchingAgent")

    async def initialize(self, context: Dict[str, Any]) -> None:
        self._status = AgentStatus.INITIALIZING

    async def validate(self, input_data: Dict[str, Any]) -> bool:
        return bool(input_data.get("product_name") and input_data.get("value_proposition"))

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self._status = AgentStatus.EXECUTING
        logger.info(f"[{self.name}] Building ICP vector filters for product '{input_data.get('product_name')}'")

        target_icp = input_data.get("target_icp", {})
        industries = target_icp.get("industries", ["Cloud SaaS", "Fintech", "Developer Tools"])
        roles = target_icp.get("target_roles", ["VP Engineering", "CTO", "Head of DevOps"])

        result = {
            "normalized_industries": industries,
            "min_employees": target_icp.get("employee_count_min", 50),
            "max_employees": target_icp.get("employee_count_max", 500),
            "target_roles": roles,
            "scoring_weights": {
                "industry_match": 40,
                "headcount_match": 30,
                "tech_signals_match": 30
            },
            "search_query_templates": [
                f"top {' '.join(industries[:2])} companies 50-500 employees",
                f"fast growing {' '.join(industries[:1])} startups AWS Kubernetes"
            ]
        }
        self._status = AgentStatus.COMPLETED
        return result

    async def cleanup(self) -> None:
        self._status = AgentStatus.IDLE

    def health(self) -> Dict[str, Any]:
        return {"agent": self.name, "status": "healthy"}

    def status(self) -> AgentStatus:
        return self._status
