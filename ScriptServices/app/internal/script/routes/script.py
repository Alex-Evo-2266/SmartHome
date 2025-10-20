import logging, asyncio
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.internal.script.schemas.script import ScriptSerializeCreate, ScriptSerialize, ScriptSerializeList, CheckResult, CheckText, EditStatus
from app.internal.script.serialize.create import save_script_to_db, update_script_to_db
from app.internal.script.serialize.get import read, read_all
from app.internal.script.serialize.status import edit_status
from app.internal.script.serialize.delete import delete_script_to_db
from app.internal.expression_parser.grammar import CommandAnaliz
from app.internal.logs import get_router_logger
from app.internal.run_script.run_script import run
from app.internal.utils.track_background_task import track_background_task

router = APIRouter(
    prefix="/api-scripts/scripts",
    tags=["scripts"],
    responses={404: {"description": "Not found"}},
)

logger = get_router_logger.get_logger(__name__)

# Добавление устройства
@router.post("")
async def add_script_url(data: ScriptSerializeCreate):
    try:
        await save_script_to_db(data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.get("/{id}", response_model=ScriptSerialize)
async def get_secript_url(id:str):
    try:
        return await read(id)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.get("", response_model=ScriptSerializeList)
async def get_secripts_url():
    try:
        return await read_all()
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.post("/check", response_model=CheckResult)
async def get_secripts_check_url(data:CheckText):
    try:
        parser = CommandAnaliz()
        parser.set_text(data.text)
        try:
            data = parser.get_tree()
            logger.debug(str(data))
            return CheckResult(result=True)
        except Exception as e:
            return CheckResult(result=False, message=str(e), index=str(len(parser.text) - len(parser.str) - 1))
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.put("/{id}")
async def edit_script(id:str, data:ScriptSerializeCreate):
    try:
        await update_script_to_db(id, data)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    
@router.patch("/{id}")
async def edit_script_status(id:str, data:EditStatus):
    try:
        await edit_status(id, data.status)
        return "ok"
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    
@router.delete("/{id}")
async def delete_script(id:str):
    try:
        await delete_script_to_db(id)
        return "ok"
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    
@router.post("/run/{id}")
async def run_script(id:str):
    try:
        track_background_task(run(id))
        return "ok"
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
