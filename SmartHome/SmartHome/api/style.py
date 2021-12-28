from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from typing import Optional, List

from SmartHome.logic.auth import auth
from SmartHome.schemas.style import StyleSchemas, StyleDeleteSchemas
from SmartHome.logic.style import addstyle, getStyles, removeStyle

router = APIRouter(
    prefix="/api/style",
    tags=["style"],
    responses={404: {"description": "Not found"}},
)

@router.post("/add")
async def add(data: StyleSchemas, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await addstyle(data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": "error add style"})
    return "ok"

@router.get("/all", response_model=List[StyleSchemas])
async def add(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    return await getStyles()

@router.post("/delete")
async def delete(data:StyleDeleteSchemas, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await removeStyle(data.name)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": res['detail']})
    return "ok"
