from typing import Any, Dict, List
from app.agents.base_agent import BaseAgent
from app.core.enums import AgentStatus
from app.services.hunter_service import HunterContactService
from app.logging.logger import logger

class ContactDiscoveryAgent(BaseAgent):
    """
    Contact Discovery Agent.
    Finds verified decision-makers matching target buyer roles at target accounts.
    """
    def __init__(self):
        super().__init__(name="ContactDiscoveryAgent")
        self.contact_service = HunterContactService()

    async def initialize(self, context: Dict[str, Any]) -> None:
        self._status = AgentStatus.INITIALIZING

    async def validate(self, input_data: Dict[str, Any]) -> bool:
        return "companies" in input_data

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self._status = AgentStatus.EXECUTING
        companies = input_data.get("companies", [])
        contacts_by_company: Dict[str, List[Dict[str, Any]]] = {}

        for comp in companies:
            comp_id = comp.get("id")
            domain = comp.get("domain", "example.com")
            logger.info(f"[{self.name}] Finding decision makers for domain '{domain}'")

            contacts = await self.contact_service.find_domain_emails(domain, limit=2)
            for idx, c in enumerate(contacts):
                c["id"] = f"cnt_{comp_id}_{idx+1}"
                c["company_id"] = comp_id
            contacts_by_company[comp_id] = contacts

        self._status = AgentStatus.COMPLETED
        return {"contacts_by_company": contacts_by_company}

    async def cleanup(self) -> None:
        self._status = AgentStatus.IDLE

    def health(self) -> Dict[str, Any]:
        return {"agent": self.name, "status": "healthy"}

    def status(self) -> AgentStatus:
        return self._status
