from typing import Any, Dict, List
from app.agents.base_agent import BaseAgent
from app.core.enums import AgentStatus
from app.logging.logger import logger

class EmailGenerationAgent(BaseAgent):
    """
    Email Generation Agent.
    Generates 3-touch cold email sequences using ONLY facts from the Research Agent.
    Line 1 of Step 1 always references a specific grounded research signal.
    If no research signals available, falls back to value-prop-only approach (no hallucination).
    """
    def __init__(self):
        super().__init__(name="EmailGenerationAgent")

    async def initialize(self, context: Dict[str, Any]) -> None:
        self._status = AgentStatus.INITIALIZING

    async def validate(self, input_data: Dict[str, Any]) -> bool:
        return bool(input_data.get("companies") and input_data.get("contacts_by_company"))

    def _build_hook_line(self, research: Dict[str, Any], comp_name: str) -> str:
        """Build Line 1 from the most relevant grounded research signal."""
        if research.get("recent_news_grounded") and research.get("recent_news"):
            snippet = research["recent_news"][:100].rstrip(".")
            return f"I came across news about {comp_name} — '{snippet}...' — and wanted to reach out."
        if research.get("expansion_grounded") and research.get("expansion_signals"):
            snippet = research["expansion_signals"][:100].rstrip(".")
            return f"Noticed that {comp_name} has been expanding — '{snippet}...' — impressive growth."
        if research.get("hiring_grounded") and research.get("hiring_signals"):
            snippet = research["hiring_signals"][:100].rstrip(".")
            return f"Saw that {comp_name} is actively hiring — '{snippet}...' — signals a great growth phase."
        if research.get("technology_grounded") and research.get("technology_signals"):
            snippet = research["technology_signals"][:100].rstrip(".")
            return f"Noticed {comp_name}'s technology footprint — '{snippet}...' — thought this might resonate."
        # Honest fallback — no hallucinated facts
        return f"I've been researching companies in your sector and {comp_name} stood out."

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self._status = AgentStatus.EXECUTING
        companies = input_data.get("companies", [])
        contacts_by_company = input_data.get("contacts_by_company", {})
        research_briefs = input_data.get("research_briefs", {})
        personalization_notes = input_data.get("personalization_notes", {})
        product_name = input_data.get("product_name", "FlytScale AI")
        value_prop = input_data.get("value_proposition", "cuts AWS costs by up to 35%")

        emails_by_contact: Dict[str, List[Dict[str, Any]]] = {}

        for comp in companies:
            comp_id = comp.get("id")
            comp_name = comp.get("name", "Company")
            contacts = contacts_by_company.get(comp_id, [])
            research = research_briefs.get(comp_id, {})
            persona = personalization_notes.get(comp_id, {})
            primary_hook = persona.get("primary_hook", value_prop)

            # Handle gracefully when no contacts found
            if not contacts:
                logger.warning(f"[{self.name}] No contacts found for '{comp_name}' — skipping email generation.")
                continue

            for contact in contacts:
                contact_id = contact.get("id", f"cnt_{comp_id}")
                first_name = contact.get("name", "there").split()[0]
                contact_title = contact.get("title", "Engineering Leader")
                is_fallback_contact = contact.get("is_fallback", False)

                logger.info(f"[{self.name}] Drafting sequence for '{first_name}' ({contact_title}) at '{comp_name}'")

                # Line 1 always from grounded research
                hook_line = self._build_hook_line(research, comp_name)

                emails_by_contact[contact_id] = [
                    {
                        "id": f"em_{contact_id}_1",
                        "contact_id": contact_id,
                        "step_number": 1,
                        "step_name": "Signal-Based Intro",
                        "subject": f"Quick question for {comp_name}'s {contact_title.split()[0]}",
                        "body": (
                            f"Hi {first_name},\n\n"
                            f"{hook_line}\n\n"
                            f"We built {product_name} to help engineering teams {value_prop}. "
                            f"Given your role leading infrastructure at {comp_name}, I thought it might be worth a brief conversation.\n\n"
                            f"Would a 10-minute call next week work for you?\n\n"
                            f"Best,\nAlex"
                        ),
                        "grounded_signal": hook_line,
                        "signal_source_url": research.get("recent_news_source_url") or research.get("expansion_signals_source_url") or "",
                        "status": "generated"
                    },
                    {
                        "id": f"em_{contact_id}_2",
                        "contact_id": contact_id,
                        "step_number": 2,
                        "step_name": "Value Proof & Case Study",
                        "subject": f"Re: Quick question for {comp_name}'s {contact_title.split()[0]}",
                        "body": (
                            f"Hi {first_name},\n\n"
                            f"Following up on my note above.\n\n"
                            f"Teams similar to {comp_name} have used {product_name} to {value_prop} — "
                            f"without changing existing infrastructure or rewriting deployment configs.\n\n"
                            f"Happy to share a short case study. Do you have 10 minutes this week?\n\n"
                            f"Best,\nAlex"
                        ),
                        "grounded_signal": None,
                        "signal_source_url": "",
                        "status": "generated"
                    },
                    {
                        "id": f"em_{contact_id}_3",
                        "contact_id": contact_id,
                        "step_number": 3,
                        "step_name": "Permission to Close File",
                        "subject": f"Should I close your file, {first_name}?",
                        "body": (
                            f"Hi {first_name},\n\n"
                            f"I'll assume this isn't a priority for {comp_name} right now, and I won't follow up again.\n\n"
                            f"If infrastructure scaling ever becomes a focus, feel free to reach out — happy to help.\n\n"
                            f"All the best,\nAlex"
                        ),
                        "grounded_signal": None,
                        "signal_source_url": "",
                        "status": "generated"
                    }
                ]

        self._status = AgentStatus.COMPLETED
        return {"emails_by_contact": emails_by_contact}

    async def cleanup(self) -> None:
        self._status = AgentStatus.IDLE

    def health(self) -> Dict[str, Any]:
        return {"agent": self.name, "status": "healthy"}

    def status(self) -> AgentStatus:
        return self._status
