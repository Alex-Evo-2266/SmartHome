import logging, os
from fastapi import APIRouter, HTTPException
from typing import List
from app.configuration.settings import ROUTE_PREFIX, DASHBOARD_FOLDER
from app.internal.dashboard.schemas.dashboard import Dashboard, DashboardsData
from app.internal.dashboard.file_utils import load_dashboard, save_dashboard

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


def list_dashboards() -> List[str]:
    """Список всех dashboards (по id из файлов)"""
    if not os.path.exists(DASHBOARD_FOLDER):
        return []
    return [
        os.path.splitext(fname)[0]
        for fname in os.listdir(DASHBOARD_FOLDER)
        if fname.endswith(".json")
    ]


@router.get("", response_model=DashboardsData)
def get_all_dashboards():
    dashboards = []
    for dash_id in list_dashboards():
        dashboards.append(load_dashboard(dash_id, DASHBOARD_FOLDER))
    return DashboardsData(dashboards=dashboards)


@router.get("/{dashboard_id}", response_model=Dashboard)
def get_dashboard(dashboard_id: str):
    try:
        return load_dashboard(dashboard_id, DASHBOARD_FOLDER)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Dashboard not found")


@router.post("", response_model=Dashboard)
def create_dashboard(dashboard: Dashboard):
    # Проверим, нет ли такого файла
    file_path = os.path.join(DASHBOARD_FOLDER, f"{dashboard.id}.json")
    if os.path.exists(file_path):
        raise HTTPException(status_code=400, detail="Dashboard with this id already exists")
    save_dashboard(dashboard, DASHBOARD_FOLDER)
    return dashboard


@router.put("/{dashboard_id}", response_model=Dashboard)
def update_dashboard(dashboard_id: str, dashboard: Dashboard):
    # Проверим, что обновляем именно тот id
    if dashboard.id != dashboard_id:
        raise HTTPException(status_code=400, detail="Dashboard id mismatch")
    file_path = os.path.join(DASHBOARD_FOLDER, f"{dashboard_id}.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dashboard not found")
    save_dashboard(dashboard, DASHBOARD_FOLDER)
    return dashboard


@router.delete("/{dashboard_id}")
def delete_dashboard(dashboard_id: str):
    file_path = os.path.join(DASHBOARD_FOLDER, f"{dashboard_id}.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dashboard not found")
    os.remove(file_path)
    return {"detail": "Dashboard deleted"}