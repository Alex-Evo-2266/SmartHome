from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from typing import Optional, List

from SmartHome.logic.auth import auth
from SmartHome.schemas.device import TypesDeviceSchema, DeviceValueSchema, DeviceSchema, DeviceStatusSchema, DeviceEditSchema
from SmartHome.logic.device.types import getDeviceTypes
from SmartHome.logic.device.getdevice import giveDevice
from SmartHome.logic.device.addDevice import addDevice
from SmartHome.logic.device.deviceSetValue import setValue
from SmartHome.logic.device.editDevice import editDevice, deleteDevice, editStatusDevice

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

@router.get("/get/{systemName}", response_model=DeviceSchema)
async def get_device(systemName:str, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await giveDevice(systemName)
    if not res:
        return JSONResponse(status_code=400, content={"message": "error get device"})
    return res

@router.post("/add")
async def add_device(data:DeviceSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await addDevice(data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/edit")
async def add_device(data:DeviceEditSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await editDevice(data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/delete/{systemName}")
async def add_device(systemName:str, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await deleteDevice(systemName)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/delete/status/set")
async def editstatusdevice(data:DeviceStatusSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await editStatusDevice(data.systemName, data.status)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/delete/value/set")
async def add_device(data:DeviceValueSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await setValue(data.systemName, data.type, data.status)
    if not res:
        return JSONResponse(status_code=400, content={"message": "error set value"})
    return "ok"
