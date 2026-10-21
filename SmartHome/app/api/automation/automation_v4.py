from fastapi import APIRouter, Depends, HTTPException, status

from app.core.entities.automation.automation_v4 import run_adapter
from app.core.state.get_store import get_container
from app.db.repositories.automation_v4.automation_io import (
    AutomationIOError,
    automation_storage,
)
from app.pkg.deps.auth import auth_privilege_dep
from app.schemas.automation.automation_v4 import AutomationSchema

router = APIRouter(
    prefix="/api-devices/automation-v4",
    tags=["automation-v4"],
)


def _ensure_safe_id(automation_id: str) -> None:
    try:
        is_safe = automation_storage.path_for(automation_id).stem == automation_id
    except AutomationIOError:
        is_safe = False
    if not is_safe:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="id должен быть допустимым именем YAML-файла",
        )


def _get_automation(automation_id: str) -> AutomationSchema:
    automation = get_container().automation_store.get_automation_by_id(automation_id)
    if automation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Автоматизация '{automation_id}' не найдена",
        )
    return automation


@router.get("", response_model=list[AutomationSchema])
async def get_automations(
    # user_id: str = Depends(auth_privilege_dep("automation")),
) -> list[AutomationSchema]:
    automations = get_container().automation_store.automations
    return [automations[key] for key in sorted(automations)]


@router.get("/{automation_id}", response_model=AutomationSchema)
async def get_automation(
    automation_id: str,
    user_id: str = Depends(auth_privilege_dep("automation")),
) -> AutomationSchema:
    return _get_automation(automation_id)


@router.post("", response_model=AutomationSchema, status_code=status.HTTP_201_CREATED)
async def create_automation(
    automation: AutomationSchema,
    # user_id: str = Depends(auth_privilege_dep("automation")),
) -> AutomationSchema:
    _ensure_safe_id(automation.id)
    manager = get_container().automation_store
    if manager.get_automation_by_id(automation.id) is not None or automation_storage.exists(
        automation.id
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Автоматизация '{automation.id}' уже существует",
        )

    try:
        automation_storage.save(automation)
    except (AutomationIOError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    manager.add_automation(automation)
    return automation


@router.put("/{automation_id}", response_model=AutomationSchema)
async def update_automation(
    automation_id: str,
    automation: AutomationSchema,
    # user_id: str = Depends(auth_privilege_dep("automation")),
) -> AutomationSchema:
    _ensure_safe_id(automation_id)
    if automation.id != automation_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="id в URL должен совпадать с id автоматизации",
        )

    manager = get_container().automation_store
    if (
        manager.get_automation_by_id(automation_id) is None
        and not automation_storage.exists(automation_id)
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Автоматизация '{automation_id}' не найдена",
        )

    try:
        automation_storage.save(automation)
    except (AutomationIOError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    manager.remove_automation(automation_id)
    manager.add_automation(automation)
    return automation


@router.delete("/{automation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_automation(
    automation_id: str,
    # user_id: str = Depends(auth_privilege_dep("automation")),
) -> None:
    _ensure_safe_id(automation_id)
    manager = get_container().automation_store
    exists_in_manager = manager.get_automation_by_id(automation_id) is not None

    try:
        exists_in_file = automation_storage.delete(automation_id)
    except (AutomationIOError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    if not exists_in_manager and not exists_in_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Автоматизация '{automation_id}' не найдена",
        )
    manager.remove_automation(automation_id)


@router.post("/{automation_id}/run")
async def run_automation(
    automation_id: str,
    # user_id: str = Depends(auth_privilege_dep("automation")),
) -> dict[str, str]:
    automation = _get_automation(automation_id)
    try:
        await run_adapter(automation, startStep=None)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка выполнения автоматизации '{automation_id}': {exc}",
        ) from exc
    return {"message": "Автоматизация запущена", "id": automation_id}
