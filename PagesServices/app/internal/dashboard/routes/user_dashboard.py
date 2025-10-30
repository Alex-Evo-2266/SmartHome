import logging, json
from fastapi import APIRouter, HTTPException, Depends
from app.configuration.settings import ROUTE_PREFIX
from app.internal.dashboard.models.dashboard import Dashboard, UserDashboard, UserDashboardLink
from app.internal.dashboard.schemas.dashboard import DashboardIn, DashboardOut, DashboardsData
from app.internal.dashboard.schemas.user_dashboard import DashboardsListUser
from app.pkg import auth_privilege_dep

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix=f"{ROUTE_PREFIX}/user-dashboard",
    tags=["user-dashboard"],
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
async def get_all_user_dashboards(user_id: str = Depends(auth_privilege_dep("base"))):
    # Получаем объект UserDashboard
    user_dashboard = await UserDashboard.objects.get_or_none(user_id=user_id)

    if(not user_dashboard):
        return DashboardsData(dashboards=[])

    # Загружаем связанные dashboards
    dashboards = await user_dashboard.dashboards.all()
    return DashboardsData(dashboards=[to_out_model(d) for d in dashboards])

@router.post("/set")
async def add_dashboard(dashboard: DashboardsListUser, user_id: str = Depends(auth_privilege_dep("base"))):
    # 1. Получаем или создаём UserDashboard
    user_dashboard, _ = await UserDashboard.objects.get_or_create(user_id=user_id)

    # 2. Получаем все Dashboard объекты для переданных id
    dashboards = await Dashboard.objects.filter(id__in=dashboard.dashboards).all()

    # 3. Удаляем старые связи через вспомогательную модель
    await UserDashboardLink.objects.filter(userdashboard=user_id).delete()

    # 4. Добавляем новые связи
    for dash in dashboards:
        await UserDashboardLink(userdashboard=user_id, dashboard=dash.id).save()
