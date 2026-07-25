from typing import List, Optional
from pydantic import BaseModel, Field

class ResearchBriefSchema(BaseModel):
    company_id: str = Field(..., description="Target company ID")
    company_summary: str = Field(..., description="High-level overview of company operations")
    recent_funding: Optional[str] = Field(None, description="Recent funding or investment news")
    hiring_signals: Optional[str] = Field(None, description="Open positions and tech stack hiring indicators")
    key_challenges: Optional[str] = Field(None, description="Inferred operational pain points")
    buying_hooks: List[str] = Field(default_factory=list, description="Extracted outreach hooks and angles")
