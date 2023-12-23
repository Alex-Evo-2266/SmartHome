from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.ingternal.authtorization.schemas.authtorization import TokenData

from app.ingternal.server_data.schemas.server_data import ServerConfigSchema, ServerDataSchema
from app.ingternal.server_data.config_set import server_config_edit
from app.ingternal.server_data.config_get import give_server_config
from app.ingternal.authtorization.depends.authtorization import token_dep
from app.ingternal.server_data.server_data import get_server_data

router = APIRouter(
    prefix="/api/server",
    tags=["server"],
    responses={404: {"description": "Not found"}},
)

@router.get("/config", response_model=ServerConfigSchema)
async def get_config(auth_data: TokenData = Depends(token_dep)):
    return await give_server_config()

@router.put("/config")
async def edit_config(data:ServerConfigSchema, auth_data: TokenData = Depends(token_dep)):
    try:
        await server_config_edit(data.moduleConfig)
        return "ok"
    except:
        return JSONResponse(status_code=400, content={"message": "error write file"})

@router.get("", response_model=ServerDataSchema)
async def get_data(auth_data: TokenData = Depends(token_dep)):
    return await get_server_data()
