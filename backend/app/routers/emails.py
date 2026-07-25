from typing import List
from fastapi import APIRouter
from app.schemas.email import EmailStepSchema, EmailUpdateSchema

router = APIRouter(prefix="/emails", tags=["Emails"])

@router.get("/contact/{contact_id}", response_model=List[EmailStepSchema], summary="Get Contact Email Sequence")
async def get_email_sequence(contact_id: str):
    """Retrieve generated email sequence steps for contact."""
    raise NotImplementedError("Endpoint signature defined; implementation pending.")

@router.put("/{email_id}", response_model=EmailStepSchema, summary="Update Email Step")
async def update_email_step(email_id: str, payload: EmailUpdateSchema):
    """Update email subject line or body text."""
    raise NotImplementedError("Endpoint signature defined; implementation pending.")
