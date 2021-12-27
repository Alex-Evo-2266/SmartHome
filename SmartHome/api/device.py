from fastapi import APIRouter, Header
from logic.auth import auth
from fastapi.responses import JSONResponse
from typing import Optional, List
from schemas.device import TypesDeviceSchema
from logic.device.types import getDeviceTypes

router = APIRouter(
    prefix="/api/device",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

@router.get("/types/get", response_model=List[TypesDeviceSchema])
async def types(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await getDeviceTypes()
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": res["ditail"]})
    return res["data"]
