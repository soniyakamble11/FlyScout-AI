from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import CampaignStatus

class TargetICPSchema(BaseModel):
    industries: List[str] = Field(default_factory=list, description="Target industry sectors")
    employee_count_min: int = Field(default=10, ge=1, description="Minimum company headcount")
    employee_count_max: int = Field(default=100000, le=1000000, description="Maximum company headcount")
    geographies: List[str] = Field(default_factory=list, description="Target geographical regions")
    target_roles: List[str] = Field(default_factory=list, description="Ideal buyer decision maker job titles")

class CampaignCreateSchema(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Campaign title")
    product_name: str = Field(..., min_length=2, max_length=100, description="Product or service name")
    value_proposition: str = Field(..., min_length=10, description="Core value prop & key benefits")
    target_icp: TargetICPSchema = Field(..., description="Target ideal customer profile settings")

class CampaignResponseSchema(CampaignCreateSchema):
    id: str = Field(..., description="Unique campaign identifier")
    status: CampaignStatus = Field(default=CampaignStatus.DRAFT, description="Current campaign status")
    created_at: str = Field(..., description="ISO 8601 creation timestamp")
