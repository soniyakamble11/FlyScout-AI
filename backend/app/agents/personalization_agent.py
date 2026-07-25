from typing import Any, Dict, List
from app.agents.base_agent import BaseAgent
from app.core.enums import AgentStatus
from app.logging.logger import logger

class PersonalizationAgent(BaseAgent):
    """
    Personalization Agent.
    Derives strategic outreach hooks exclusively from the Research Agent's grounded output.
    No static strings — every hook references a specific signal found during research.
    """
    def __init__(self):
        super().__init__(name="PersonalizationAgent")

    async def initialize(self, context: Dict[str, Any]) -> None:
        self._status = AgentStatus.INITIALIZING

    async def validate(self, input_data: Dict[str, Any]) -> bool:
        return "research_briefs" in input_data

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self._status = AgentStatus.EXECUTING
        research_briefs = input_data.get("research_briefs", {})
        product_name = input_data.get("product_name", "FlytScale AI")
        value_proposition = input_data.get("value_proposition", "automates cloud infrastructure scaling")
        personalization_notes: Dict[str, Dict[str, Any]] = {}

        for comp_id, brief in research_briefs.items():
            comp_name = brief.get("company_name", "Company")
            logger.info(f"[{self.name}] Deriving personalization hooks for '{comp_name}' from research signals")

            hooks: List[Dict[str, Any]] = []

            # Hook 1: From funding / recent news signal
            if brief.get("recent_news_grounded") and brief.get("recent_news"):
                snippet = brief["recent_news"][:150]
                hooks.append({
                    "hook_type": "funding_signal",
                    "reasoning": f"Research found this funding/news signal at {comp_name}: '{snippet}'. Opening Line 1 with this shows you did your homework.",
                    "outreach_angle": f"Reference their recent funding/news milestone to establish context immediately.",
                    "source_url": brief.get("recent_news_source_url", "")
                })

            # Hook 2: From technology signals
            if brief.get("technology_grounded") and brief.get("technology_signals"):
                snippet = brief["technology_signals"][:150]
                hooks.append({
                    "hook_type": "tech_signal",
                    "reasoning": f"Research detected technology footprint at {comp_name}: '{snippet}'. This directly reveals where {product_name} can add value.",
                    "outreach_angle": f"Connect their tech stack challenges to the specific value {product_name} delivers.",
                    "source_url": brief.get("technology_signals_source_url", "")
                })

            # Hook 3: From hiring signals
            if brief.get("hiring_grounded") and brief.get("hiring_signals"):
                snippet = brief["hiring_signals"][:150]
                hooks.append({
                    "hook_type": "hiring_signal",
                    "reasoning": f"Research found hiring activity at {comp_name}: '{snippet}'. Hiring sprees signal growth and infrastructure pain.",
                    "outreach_angle": f"Use their infrastructure hiring signals to show {product_name} reduces manual DevOps overhead.",
                    "source_url": brief.get("hiring_signals_source_url", "")
                })

            # Hook 4: From expansion signals
            if brief.get("expansion_grounded") and brief.get("expansion_signals"):
                snippet = brief["expansion_signals"][:150]
                hooks.append({
                    "hook_type": "expansion_signal",
                    "reasoning": f"Research found expansion activity at {comp_name}: '{snippet}'. Expansion increases cloud cost exposure.",
                    "outreach_angle": f"Tie their expansion signals to the cloud scalability challenge {product_name} solves.",
                    "source_url": brief.get("expansion_signals_source_url", "")
                })

            # Fallback if no grounded hooks derived
            if not hooks:
                hooks.append({
                    "hook_type": "general",
                    "reasoning": f"No specific signals grounded from research for '{comp_name}'. Generic value-led approach recommended.",
                    "outreach_angle": f"Lead with the core value proposition: {value_proposition}",
                    "source_url": ""
                })

            personalization_notes[comp_id] = {
                "company_name": comp_name,
                "product_name": product_name,
                "value_proposition": value_proposition,
                "hooks": hooks,
                "primary_hook": hooks[0]["outreach_angle"] if hooks else value_proposition
            }

        self._status = AgentStatus.COMPLETED
        return {"personalization_notes": personalization_notes}

    async def cleanup(self) -> None:
        self._status = AgentStatus.IDLE

    def health(self) -> Dict[str, Any]:
        return {"agent": self.name, "status": "healthy"}

    def status(self) -> AgentStatus:
        return self._status
