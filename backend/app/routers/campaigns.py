from typing import List
from fastapi import APIRouter, status, HTTPException
from app.schemas.campaign import CampaignCreateSchema, CampaignResponseSchema
from app.services.storage_service import storage_instance
from app.utils.helpers import generate_uuid, get_utc_now_iso
from app.core.enums import CampaignStatus

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

@router.post("", response_model=CampaignResponseSchema, status_code=status.HTTP_201_CREATED, summary="Create Campaign")
async def create_campaign(payload: CampaignCreateSchema):
    """Create a new outbound BDR outreach campaign from Campaign Brief."""
    campaign_id = generate_uuid("cmp")
    campaign_data = {
        "id": campaign_id,
        "name": payload.name,
        "product_name": payload.product_name,
        "value_proposition": payload.value_proposition,
        "target_icp": payload.target_icp.model_dump(),
        "status": CampaignStatus.DRAFT,
        "created_at": get_utc_now_iso()
    }
    await storage_instance.save("campaigns", campaign_id, campaign_data)
    return campaign_data

@router.get("", response_model=List[CampaignResponseSchema], summary="List Campaigns")
async def list_campaigns():
    """Retrieve all outreach campaigns."""
    campaigns = await storage_instance.list_all("campaigns")
    if not campaigns:
        # Pre-seed default campaign brief if empty
        default_cmp = {
            "id": "cmp_demo_01",
            "name": "FlytScale B2B AI Enterprise Outreach",
            "product_name": "FlytScale AI",
            "value_proposition": "Automates cloud infrastructure scaling for high-growth SaaS engineering teams, reducing AWS bills by up to 35% using predictive workload modeling.",
            "target_icp": {
                "industries": ["Cloud SaaS", "Fintech", "Developer Tools"],
                "employee_count_min": 50,
                "employee_count_max": 500,
                "geographies": ["North America", "Remote"],
                "target_roles": ["VP Engineering", "CTO", "Head of DevOps"]
            },
            "status": CampaignStatus.COMPLETED,
            "created_at": get_utc_now_iso()
        }
        await storage_instance.save("campaigns", "cmp_demo_01", default_cmp)
        return [default_cmp]
    return campaigns

@router.get("/{campaign_id}", response_model=CampaignResponseSchema, summary="Get Campaign Details")
async def get_campaign(campaign_id: str):
    """Get single campaign details by ID."""
    campaign = await storage_instance.get("campaigns", campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
