from pydantic import BaseModel, Field

class EmailStepSchema(BaseModel):
    id: str = Field(..., description="Email step ID")
    contact_id: str = Field(..., description="Target contact ID")
    step_number: int = Field(..., ge=1, le=5, description="Sequence step number (1=Intro, 2=Followup, 3=Breakup)")
    step_name: str = Field(..., description="Step label")
    subject: str = Field(..., description="Email subject line")
    body: str = Field(..., description="Email body text")
    status: str = Field(default="generated", description="Email status (generated | edited | sent)")

class EmailUpdateSchema(BaseModel):
    subject: str = Field(..., description="Updated subject line")
    body: str = Field(..., description="Updated body content")
