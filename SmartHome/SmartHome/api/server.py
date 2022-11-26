from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from authtorization.schema import TokenData

from SmartHome.schemas.server import ServerConfigSchema, ServerDataSchema
from config.configset import ServerConfigEdit
from authtorization.auth_depends import token_dep
from config.configget import GiveServerConfig
from SmartHome.logic.server.serverData import getServerData

router = APIRouter(
    prefix="/api/server",
    tags=["server"],
    responses={404: {"description": "Not found"}},
)

@router.get("/config", response_model=ServerConfigSchema)
async def getconfig(auth_data: TokenData = Depends(token_dep)):
    return await GiveServerConfig()

@router.put("/config")
async def getconfig(data:ServerConfigSchema, auth_data: TokenData = Depends(token_dep)):
    res = await ServerConfigEdit(data.moduleConfig)
    if res["status"] == "ok":
        return "ok"
    return JSONResponse(status_code=400, content={"message": "error write file"})

@router.get("", response_model=ServerDataSchema)
async def getdata(auth_data: TokenData = Depends(token_dep)):
    return await getServerData()
