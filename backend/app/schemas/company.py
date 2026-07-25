from typing import Optional
from pydantic import BaseModel, Field, HttpUrl

class CompanySchema(BaseModel):
    id: str = Field(..., description="Unique company ID")
    name: str = Field(..., description="Company name")
    domain: str = Field(..., description="Primary domain")
    industry: Optional[str] = Field(None, description="Industry sector")
    employee_count: Optional[int] = Field(None, description="Estimated employee headcount")
    headquarters: Optional[str] = Field(None, description="HQ location")
    icp_score: int = Field(default=0, ge=0, le=100, description="Computed ICP fit score (0-100)")
    icp_rationale: Optional[str] = Field(None, description="Reasoning behind ICP fit score")
