from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.schemas.automation.automation import AutomationSchema, EnableSchema, AutomationResponseSchema
from app.db.repositories.automation.add_automation import add_automation
from app.db.repositories.automation.get_model import get_automation, get_all_automation
from app.db.repositories.automation.delete import delete_automation
from app.db.repositories.automation.update import update_automation, update_status
from app.pkg.deps.auth import auth_privilege_dep
from app.pkg.logger import MyLogger

router = APIRouter(
    prefix="/api-devices/automation",
    tags=["automation"],
    responses={404: {"description": "Not found"}},
)

logger = MyLogger().get_logger(__name__)

# Добавление устройства
@router.post("")
async def test(data: AutomationSchema, user_id:str =Depends(auth_privilege_dep("automation"))):
    try:
        await add_automation(data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.get("", response_model=AutomationResponseSchema)
async def get_all(user_id:str =Depends(auth_privilege_dep("automation"))):
    try:
        return AutomationResponseSchema(data=await get_all_automation())
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.get("/{name}", response_model=AutomationSchema)
async def get(name:str, user_id:str =Depends(auth_privilege_dep("automation"))):
    try:
        return await get_automation(name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.delete("/{name}")
async def delete_automation_api(name:str, user_id:str =Depends(auth_privilege_dep("automation"))):
    try:
        await delete_automation(name)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.put("/{name}")
async def update_automation_api(name:str, data: AutomationSchema, user_id:str =Depends(auth_privilege_dep("automation"))):
    try:
        await update_automation(name, data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.patch("/{name}/enable")
async def patch_automation_api(name:str, data: EnableSchema, user_id:str=Depends(auth_privilege_dep("automation"))):
    try:
        await update_status(name, data.is_enabled)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

