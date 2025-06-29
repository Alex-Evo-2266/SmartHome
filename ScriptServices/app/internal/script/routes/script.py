import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Dict
from typing import Optional, List, Union
from app.internal.script.schemas.script import ScriptSerializeCreate, ScriptSerialize, ScriptSerializeList
from app.internal.script.serialize.create import save_script_to_db
from app.internal.script.serialize.get import serialize_script
from app.internal.script.models.script import Script

router = APIRouter(
    prefix="/api-scripts/scripts",
    tags=["scripts"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

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
        script = await Script.objects.get_or_none(id=id)
        if script is None:
            return JSONResponse(status_code=400, content={"error: script not found"})
        data = await serialize_script(script)
        return data
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.get("", response_model=ScriptSerializeList)
async def get_secripts_url():
    try:
        scripts = await Script.objects.all()
        data = [await serialize_script(script) for script in scripts]
        return ScriptSerializeList(scripts=data)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
