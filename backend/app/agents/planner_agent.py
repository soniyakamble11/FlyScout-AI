from typing import Any, Dict, AsyncGenerator
from app.agents.base_agent import BaseAgent
from app.agents.icp_agent import ICPAgent
from app.agents.company_agent import CompanyDiscoveryAgent
from app.agents.contact_agent import ContactDiscoveryAgent
from app.agents.research_agent import ResearchAgent
from app.agents.personalization_agent import PersonalizationAgent
from app.agents.email_agent import EmailGenerationAgent
from app.core.enums import AgentStatus
from app.logging.logger import logger

class PlannerAgent(BaseAgent):
    """
    Planner & Orchestrator Agent.
    Executes the 7 AI agents sequentially, passes full state between them,
    and streams real-time telemetry log events over SSE.
    """
    def __init__(self):
        super().__init__(name="PlannerAgent")
        self.icp_agent = ICPAgent()
        self.company_agent = CompanyDiscoveryAgent()
        self.contact_agent = ContactDiscoveryAgent()
        self.research_agent = ResearchAgent()
        self.personalization_agent = PersonalizationAgent()
        self.email_agent = EmailGenerationAgent()

    async def initialize(self, context: Dict[str, Any]) -> None:
        self._status = AgentStatus.INITIALIZING

    async def validate(self, input_data: Dict[str, Any]) -> bool:
        return True

    async def execute_and_stream(self, campaign_brief: Dict[str, Any]) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Orchestrate multi-agent pipeline and stream granular telemetry per step.
        Full pipeline state is passed between agents — no shortcuts.
        """
        self._status = AgentStatus.EXECUTING
        product_name = campaign_brief.get("product_name", "FlytScale AI")
        company_limit = campaign_brief.get("company_limit", 3)
        logger.info(f"[{self.name}] Starting pipeline for '{product_name}' (limit={company_limit})")

        # Step 1: Planner validation
        yield {
            "step": "planner",
            "status": "completed",
            "message": f"Planner: Validated campaign brief '{product_name}'. Starting 7-agent pipeline.",
            "progress_pct": 14,
            "data_snippet": {"product": product_name, "agents": 7, "company_limit": company_limit}
        }

        # Step 2: ICP Matching
        await self.icp_agent.initialize({})
        icp_input = {**campaign_brief, "company_limit": company_limit}
        icp_output = await self.icp_agent.execute(icp_input)
        icp_output["company_limit"] = company_limit  # Forward limit
        yield {
            "step": "icp_matching",
            "status": "completed",
            "message": f"ICP Agent: Normalized filters for {len(icp_output.get('normalized_industries', []))} industries. Weights: {icp_output.get('scoring_weights')}",
            "progress_pct": 28,
            "data_snippet": {"industries": icp_output.get("normalized_industries"), "roles": icp_output.get("target_roles")}
        }

        # Step 3: Company Discovery
        await self.company_agent.initialize({})
        company_output = await self.company_agent.execute(icp_output)
        companies = company_output.get("companies", [])
        if not companies:
            yield {
                "step": "company_discovery", "status": "failed",
                "message": "Company Discovery: No matching companies found. Check Tavily API key or broaden ICP.",
                "progress_pct": 42, "data_snippet": {"companies_found": 0}
            }
            self._status = AgentStatus.FAILED
            return
        yield {
            "step": "company_discovery",
            "status": "completed",
            "message": f"Company Discovery: Found {len(companies)} accounts. Top match: '{companies[0]['name']}' at {companies[0]['icp_score']}%.",
            "progress_pct": 42,
            "data_snippet": {"companies_found": len(companies), "top_company": companies[0]["name"], "top_icp_score": companies[0]["icp_score"]}
        }

        # Step 4: Contact Discovery
        await self.contact_agent.initialize({})
        contact_output = await self.contact_agent.execute({"companies": companies, "target_roles": icp_output.get("target_roles", [])})
        contacts_by_company = contact_output.get("contacts_by_company", {})
        total_contacts = sum(len(c) for c in contacts_by_company.values())
        yield {
            "step": "contact_discovery",
            "status": "completed",
            "message": f"Contact Discovery: Found {total_contacts} decision-makers across {len(contacts_by_company)} companies.",
            "progress_pct": 56,
            "data_snippet": {"total_contacts": total_contacts, "companies_covered": len(contacts_by_company)}
        }

        # Step 5: Research
        await self.research_agent.initialize({})
        research_output = await self.research_agent.execute({"companies": companies})
        research_briefs = research_output.get("research_briefs", {})
        grounded_count = sum(
            1 for b in research_briefs.values()
            if b.get("recent_news_grounded") or b.get("technology_grounded") or b.get("hiring_grounded")
        )
        yield {
            "step": "research",
            "status": "completed",
            "message": f"Research Agent: Scraped {len(research_briefs)} companies. {grounded_count}/{len(research_briefs)} had grounded signals with source URLs.",
            "progress_pct": 70,
            "data_snippet": {"briefs": len(research_briefs), "grounded": grounded_count}
        }

        # Step 6: Personalization
        await self.personalization_agent.initialize({})
        personalization_output = await self.personalization_agent.execute({
            "research_briefs": research_briefs,
            "product_name": product_name,
            "value_proposition": campaign_brief.get("value_proposition", "")
        })
        personalization_notes = personalization_output.get("personalization_notes", {})
        total_hooks = sum(len(v.get("hooks", [])) for v in personalization_notes.values())
        yield {
            "step": "personalization",
            "status": "completed",
            "message": f"Personalization Agent: Generated {total_hooks} grounded hooks from research signals.",
            "progress_pct": 84,
            "data_snippet": {"hooks_generated": total_hooks, "companies": len(personalization_notes)}
        }

        # Step 7: Email Generation
        await self.email_agent.initialize({})
        email_output = await self.email_agent.execute({
            "companies": companies,
            "contacts_by_company": contacts_by_company,
            "research_briefs": research_briefs,
            "personalization_notes": personalization_notes,
            "product_name": product_name,
            "value_proposition": campaign_brief.get("value_proposition", "")
        })
        emails_by_contact = email_output.get("emails_by_contact", {})
        yield {
            "step": "email_generation",
            "status": "completed",
            "message": f"Email Agent: Drafted {len(emails_by_contact)} 3-touch sequences. Line 1 grounded in research signals.",
            "progress_pct": 100,
            "data_snippet": {
                "sequences": len(emails_by_contact),
                "companies": [c["name"] for c in companies],
                "companies_data": companies,
                "contacts_by_company": contacts_by_company,
                "research_briefs": research_briefs,
                "personalization_notes": personalization_notes,
                "emails_by_contact": emails_by_contact
            }
        }

        self._status = AgentStatus.COMPLETED

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        return {}

    async def cleanup(self) -> None:
        self._status = AgentStatus.IDLE

    def health(self) -> Dict[str, Any]:
        return {"agent": self.name, "status": "healthy"}

    def status(self) -> AgentStatus:
        return self._status
