import logging
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from app.internal.dashboard.models.dashboard import UserDashboard

from app.configuration.settings import ROUTE_PREFIX, DASHBOARD_FOLDER
from app.internal.dashboard.schemas.dashboard import (
    DashboardIn,
    DashboardOut,
    DashboardsData,
    ActiveDashboardsData,
    ActiveDashboardOut
)
from app.internal.dashboard.storage.dashboard_storage import (
    DashboardStorage,
)
from app.pkg import auth_privilege_dep


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix=f"{ROUTE_PREFIX}/dashboard",
    tags=["dashboard"],
    responses={
        404: {
            "description": "Not found",
        },
    },
)


dashboard_storage = DashboardStorage(
    root=Path(DASHBOARD_FOLDER),
)


# ======================================================================
# USER DASHBOARDS
# ======================================================================


@router.get(
    "/active",
    response_model=ActiveDashboardsData,
)
async def get_active_dashboards(
    user_id: str = Depends(
        auth_privilege_dep("base")
    ),
):
    dashboards = await UserDashboard.objects.filter(
        user_id=user_id,
    ).all()

    return ActiveDashboardsData(
        dashboards=[
            ActiveDashboardOut(
                id=dashboard.dashboard_id,
                title=dashboard.title,
            )
            for dashboard in dashboards
        ]
    )

@router.get(
    "",
    response_model=DashboardsData,
)
async def get_all_dashboards(
    user_id: str = Depends(
        auth_privilege_dep("base")
    ),
):
    """
    Возвращает все доступные пользователю dashboard.

    Если существует:

        global/home.yml

    и:

        users/123/home.yml

    пользователю будет возвращён только:

        users/123/home.yml

    """

    dashboards = dashboard_storage.list_for_user(
        model=DashboardOut,
        user_id=user_id,
    )

    return DashboardsData(
        dashboards=[
            DashboardOut.model_validate(dashboard)
            for dashboard in dashboards
        ]
    )

@router.post(
    "",
    response_model=DashboardOut,
)
async def create_dashboard(
    dashboard: DashboardIn,
    user_id: str = Depends(
        auth_privilege_dep("page")
    ),
):
    """
    Создаёт пользовательский dashboard.
    """

    exists = dashboard_storage.exists(
        dashboard_id=dashboard.id,
        scope="user",
        user_id=user_id,
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Dashboard with this id already exists",
        )

    dashboard_storage.save(
        dashboard_id=dashboard.id,
        dashboard=dashboard,
        scope="user",
        user_id=user_id,
    )

    return DashboardOut.model_validate(
        dashboard.model_dump()
    )




# ======================================================================
# GLOBAL DASHBOARDS
# ======================================================================


@router.get(
    "/global/list",
    response_model=DashboardsData,
)
async def get_global_dashboards(
    _: str = Depends(
        auth_privilege_dep("page")
    ),
):
    """
    Возвращает глобальные dashboard.
    """

    dashboards = dashboard_storage.list(
        model=DashboardIn,
        scope="global",
    )

    return DashboardsData(
        dashboards=[
            DashboardOut.model_validate(dashboard)
            for dashboard in dashboards
        ]
    )


@router.get(
    "/global/{dashboard_id}",
    response_model=DashboardOut,
)
async def get_global_dashboard(
    dashboard_id: str,
    _: str = Depends(
        auth_privilege_dep("page")
    ),
):
    """
    Получить конкретный глобальный dashboard.
    """

    dashboard = dashboard_storage.get(
        dashboard_id=dashboard_id,
        model=DashboardIn,
        scope="global",
    )

    if dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Global dashboard not found",
        )

    return DashboardOut.model_validate(
        dashboard
    )


@router.post(
    "/global",
    response_model=DashboardOut,
)
async def create_global_dashboard(
    dashboard: DashboardIn,
    _: str = Depends(
        auth_privilege_dep("admin")
    ),
):
    """
    Создаёт глобальный dashboard.

    Доступ только для admin.
    """

    exists = dashboard_storage.exists(
        dashboard_id=dashboard.id,
        scope="global",
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Global dashboard with this id already exists",
        )

    dashboard_storage.save(
        dashboard_id=dashboard.id,
        dashboard=dashboard,
        scope="global",
    )

    return DashboardOut.model_validate(
        dashboard
    )


@router.put(
    "/global/{dashboard_id}",
    response_model=DashboardOut,
)
async def update_global_dashboard(
    dashboard_id: str,
    dashboard: DashboardIn,
    _: str = Depends(
        auth_privilege_dep("admin")
    ),
):
    """
    Обновляет глобальный dashboard.
    """

    if dashboard.id != dashboard_id:
        raise HTTPException(
            status_code=400,
            detail="Dashboard id mismatch",
        )

    exists = dashboard_storage.exists(
        dashboard_id=dashboard_id,
        scope="global",
    )

    if not exists:
        raise HTTPException(
            status_code=404,
            detail="Global dashboard not found",
        )

    dashboard_storage.save(
        dashboard_id=dashboard_id,
        dashboard=dashboard,
        scope="global",
    )

    return DashboardOut.model_validate(
        dashboard
    )


@router.delete(
    "/global/{dashboard_id}",
)
async def delete_global_dashboard(
    dashboard_id: str,
    _: str = Depends(
        auth_privilege_dep("admin")
    ),
):
    """
    Удаляет глобальный dashboard.
    """

    deleted = dashboard_storage.delete(
        dashboard_id=dashboard_id,
        scope="global",
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Global dashboard not found",
        )

    return {
        "detail": "Global dashboard deleted",
    }


@router.get(
    "/{dashboard_id}",
    response_model=DashboardOut,
)
async def get_dashboard(
    dashboard_id: str,
    user_id: str = Depends(
        auth_privilege_dep("base")
    ),
):
    """
    Получает dashboard пользователя.

    Приоритет:

        users/{user_id}/{dashboard_id}.yml

    затем:

        global/{dashboard_id}.yml
    """

    dashboard = dashboard_storage.get_for_user(
        dashboard_id=dashboard_id,
        model=DashboardIn,
        user_id=user_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Dashboard not found",
        )

    return DashboardOut.model_validate(
        dashboard.model_dump()
    )



@router.put(
    "/{dashboard_id}",
    response_model=DashboardOut,
)
async def update_dashboard(
    dashboard_id: str,
    dashboard: DashboardIn,
    user_id: str = Depends(
        auth_privilege_dep("page")
    ),
):
    """
    Обновляет пользовательский dashboard.

    Важно:

    Если существует только глобальный dashboard,
    PUT создаст пользовательскую копию.

        global/home.yml

    после PUT:

        global/home.yml
        users/123/home.yml

    Пользователь начнёт видеть свою версию.
    """

    if dashboard.id != dashboard_id:
        raise HTTPException(
            status_code=400,
            detail="Dashboard id mismatch",
        )

    dashboard_storage.save(
        dashboard_id=dashboard_id,
        dashboard=dashboard,
        scope="user",
        user_id=user_id,
    )

    return DashboardOut.model_validate(
        dashboard.model_dump()
    )


@router.delete(
    "/{dashboard_id}",
)
async def delete_dashboard(
    dashboard_id: str,
    user_id: str = Depends(
        auth_privilege_dep("page")
    ),
):
    """
    Удаляет пользовательскую версию dashboard.

    Если существовала глобальная версия,
    после удаления пользователь снова увидит её.
    """

    deleted = dashboard_storage.delete(
        dashboard_id=dashboard_id,
        scope="user",
        user_id=user_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Dashboard not found",
        )

    return {
        "detail": "Dashboard deleted",
    }


@router.post("/{dashboard_id}/activate")
async def activate_dashboard(
    dashboard_id: str,
    user_id: str = Depends(
        auth_privilege_dep("page")
    ),
):
    dashboard = dashboard_storage.get_for_user(
        dashboard_id=dashboard_id,
        model=DashboardIn,
        user_id=user_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Dashboard not found",
        )

    exists = await UserDashboard.objects.get_or_none(
        user_id=user_id,
        dashboard_id=dashboard_id,
    )

    if exists is None:
        await UserDashboard.objects.create(
            user_id=user_id,
            dashboard_id=dashboard_id,
            title=dashboard.title,
        )

    return {
        "dashboard_id": dashboard_id,
        "active": True,
    }

@router.delete("/{dashboard_id}/activate")
async def deactivate_dashboard(
    dashboard_id: str,
    user_id: str = Depends(
        auth_privilege_dep("page")
    ),
):
    dashboard = await UserDashboard.objects.get_or_none(
        user_id=user_id,
        dashboard_id=dashboard_id,
    )

    if dashboard is not None:
        await dashboard.delete()

    return {
        "dashboard_id": dashboard_id,
        "active": False,
    }