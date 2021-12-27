from fastapi import APIRouter, Header
from logic.auth import auth
from fastapi.responses import JSONResponse
from typing import Optional, List
from schemas.server import ServerConfigSchema, ServerDataSchema
from logic.server.configset import ServerConfigEdit
from logic.server.configget import GiveServerConfig,readConfig
from logic.server.serverData import getServerData

router = APIRouter(
    prefix="/api/server",
    tags=["server"],
    responses={404: {"description": "Not found"}},
)

@router.get("/config/get", response_model=ServerConfigSchema)
async def getconfig(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    return await GiveServerConfig()

@router.post("/config/edit")
async def getconfig(data:ServerConfigSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await ServerConfigEdit(data)
    if res["status"] == "ok":
        return "ok"
    return JSONResponse(status_code=400, content={"message": "error write file"})

@router.get("/data/get", response_model=ServerDataSchema)
async def getdata(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    return await getServerData()
