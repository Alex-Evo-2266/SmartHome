from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

from SmartHome.logic.auth import auth
from SmartHome.schemas.device import TypesDeviceSchema, DeviceValueSchema, DeviceSchema, DeviceStatusSchema, DeviceEditSchema
from SmartHome.logic.device.types import getDeviceTypes
from SmartHome.logic.device.getdevice import giveDevice
from SmartHome.logic.device.addDevice import addDevice
from SmartHome.depends.auth import token_dep
from SmartHome.logic.device.deviceSetValue import setValue
from SmartHome.logic.device.editDevice import editDevice, deleteDevice, editStatusDevice

router = APIRouter(
    prefix="/api/device",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

@router.get("/types/get", response_model=List[TypesDeviceSchema])
async def types(auth_data: dict = Depends(token_dep)):
    res = await getDeviceTypes()
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": res["ditail"]})
    return res["data"]

@router.get("/get/{systemName}", response_model=DeviceSchema)
async def get_device(systemName:str, auth_data: dict = Depends(token_dep)):
    res = await giveDevice(systemName)
    if not res:
        return JSONResponse(status_code=400, content={"message": "error get device"})
    return res

@router.post("/add")
async def add_device(data:DeviceSchema, auth_data: dict = Depends(token_dep)):
    res = await addDevice(data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/edit")
async def add_device(data:DeviceEditSchema, auth_data: dict = Depends(token_dep)):
    res = await editDevice(data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/delete/{systemName}")
async def add_device(systemName:str, auth_data: dict = Depends(token_dep)):
    res = await deleteDevice(systemName)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/status/set")
async def editstatusdevice(data:DeviceStatusSchema, auth_data: dict = Depends(token_dep)):
    res = await editStatusDevice(data.systemName, data.status)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": f"error add device. {res['detail']}"})
    return "ok"

@router.post("/value/set")
async def add_device(data:DeviceValueSchema, auth_data: dict = Depends(token_dep)):
    res = await setValue(data.systemName, data.type, data.status)
    if not res:
        return JSONResponse(status_code=400, content={"message": "error set value"})
    return "ok"
