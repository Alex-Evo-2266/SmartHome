import logging, json
from fastapi import APIRouter, HTTPException, Depends
from app.configuration.settings import ROUTE_PREFIX
from app.internal.dashboard.models.dashboard import Dashboard
from app.internal.dashboard.schemas.dashboard import DashboardIn, DashboardOut, DashboardsData
from app.pkg import auth_privilege_dep

logger = logging.getLogger(__name__)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(filename)s: %(asctime)s - %(levelname)s - %(message)s"
)

router = APIRouter(
    prefix=f"{ROUTE_PREFIX}/dashboard",
    tags=["dashboard"],
    responses={404: {"description": "Not found"}},
)

def to_out_model(dashboard: Dashboard) -> DashboardOut:
    """Преобразует модель БД в Pydantic с cards как объектами"""
    cards = json.loads(dashboard.data) if dashboard.data else []
    return DashboardOut(
        id=dashboard.id,
        user_id=dashboard.user_id,
        title=dashboard.title,
        private=dashboard.private,
        cards=cards
    )

@router.get("", response_model=DashboardsData)
async def get_all_dashboards():
    dashboards = await Dashboard.objects.all()
    return DashboardsData(dashboards=[to_out_model(d) for d in dashboards])

@router.get("/{dashboard_id}", response_model=DashboardOut)
async def get_dashboard(dashboard_id: str):
    dashboard = await Dashboard.objects.get_or_none(id=dashboard_id)
    if dashboard is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return to_out_model(dashboard)

@router.post("", response_model=DashboardOut)
async def create_dashboard(dashboard: DashboardIn, user: str = Depends(auth_privilege_dep("device"))):
    exists = await Dashboard.objects.get_or_none(id=dashboard.id)
    if exists:
        raise HTTPException(status_code=400, detail="Dashboard with this id already exists")
    obj = await Dashboard.objects.create(
        id=dashboard.id,
        user_id=user,
        title=dashboard.title,
        private=dashboard.private,
        data=json.dumps([card.dict() for card in dashboard.cards])
    )
    return to_out_model(obj)

@router.put("/{dashboard_id}", response_model=DashboardOut)
async def update_dashboard(dashboard_id: str, dashboard: DashboardIn):
    if dashboard.id != dashboard_id:
        raise HTTPException(status_code=400, detail="Dashboard id mismatch")
    obj = await Dashboard.objects.get_or_none(id=dashboard_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    await obj.update(
        title=dashboard.title,
        private=dashboard.private,
        data=json.dumps([card.dict() for card in dashboard.cards])
    )
    return to_out_model(obj)

@router.delete("/{dashboard_id}")
async def delete_dashboard(dashboard_id: str):
    obj = await Dashboard.objects.get_or_none(id=dashboard_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    await obj.delete()
    return {"detail": "Dashboard deleted"}
