from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

from SmartHome.logic.auth import auth
from SmartHome.schemas.server import ServerConfigSchema, ServerDataSchema
from SmartHome.logic.server.configset import ServerConfigEdit
from SmartHome.depends.auth import token_dep
from SmartHome.logic.server.configget import GiveServerConfig
from SmartHome.logic.server.serverData import getServerData

router = APIRouter(
    prefix="/api/server",
    tags=["server"],
    responses={404: {"description": "Not found"}},
)

@router.get("/config/get", response_model=ServerConfigSchema)
async def getconfig(auth_data: dict = Depends(token_dep)):
    return await GiveServerConfig()

@router.post("/config/edit")
async def getconfig(data:ServerConfigSchema, auth_data: dict = Depends(token_dep)):
    res = await ServerConfigEdit(data)
    if res["status"] == "ok":
        return "ok"
    return JSONResponse(status_code=400, content={"message": "error write file"})

@router.get("/data/get", response_model=ServerDataSchema)
async def getdata(auth_data: dict = Depends(token_dep)):
    return await getServerData()
