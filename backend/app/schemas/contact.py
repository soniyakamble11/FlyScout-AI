from typing import Optional
from pydantic import BaseModel, Field, EmailStr

class ContactSchema(BaseModel):
    id: str = Field(..., description="Unique contact ID")
    company_id: str = Field(..., description="Associated company ID")
    name: str = Field(..., description="Full name of prospect")
    title: str = Field(..., description="Job title / role")
    email: Optional[str] = Field(None, description="Work email address")
    email_verified: bool = Field(default=False, description="Email verification status flag")
    linkedin_url: Optional[str] = Field(None, description="LinkedIn profile URL")
