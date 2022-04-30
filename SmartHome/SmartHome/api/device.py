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
from SmartHome.schemas.base import FunctionRespons, TypeRespons
from SmartHome.logic.device.deviceHistory import getHistory
from SmartHome.models import DeviceHistory

router = APIRouter(
    prefix="/api/device",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

@router.get("/types/get", response_model=List[TypesDeviceSchema])
async def types(auth_data: dict = Depends(token_dep)):
    res = await getDeviceTypes()
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": res["detail"]})
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
    if res.status == TypeRespons.INVALID:
        return JSONResponse(status_code=400, content={"message": f"error add device. {res.detail}"})
    if res.status == TypeRespons.ERROR:
        return JSONResponse(status_code=500, content={"message": f"error add device. {res.detail}"})
    return "ok"

@router.post("/edit")
async def add_device(data:DeviceEditSchema, auth_data: dict = Depends(token_dep)):
    res = await editDevice(data)
    if res.status == TypeRespons.INVALID:
        return JSONResponse(status_code=400, content={"message": f"error edit device. {res.detail}"})
    if res.status == TypeRespons.ERROR:
        return JSONResponse(status_code=500, content={"message": f"error edit device. {res.detail}"})
    return "ok"

@router.post("/delete/{systemName}")
async def add_device(systemName:str, auth_data: dict = Depends(token_dep)):
    res = await deleteDevice(systemName)
    if res.status == TypeRespons.INVALID:
        return JSONResponse(status_code=400, content={"message": f"error delete device. {res.detail}"})
    if res.status == TypeRespons.ERROR:
        return JSONResponse(status_code=500, content={"message": f"error delete device. {res.detail}"})
    return "ok"

@router.post("/status/set")
async def editstatusdevice(data:DeviceStatusSchema, auth_data: dict = Depends(token_dep)):
    res = await editStatusDevice(data.systemName, data.status)
    if res.status == TypeRespons.INVALID:
        return JSONResponse(status_code=400, content={"message": f"error edit status device. {res.detail}"})
    if res.status == TypeRespons.ERROR:
        return JSONResponse(status_code=500, content={"message": f"error edit status device. {res.detail}"})
    return "ok"

@router.post("/value/set")
async def add_device(data:DeviceValueSchema, auth_data: dict = Depends(token_dep)):
    res = await setValue(data.systemName, data.type, data.status)
    if not res:
        return JSONResponse(status_code=400, content={"message": "error set value"})
    return "ok"

@router.get("/history/get/{systemName}", response_model=List[DeviceHistory])
async def getHistoryapi(systemName:str, auth_data: dict = Depends(token_dep)):
    res = await getHistory(systemName)
    if res.status == TypeRespons.INVALID:
        return JSONResponse(status_code=400, content={"message": res.detail})
    if res.status == TypeRespons.ERROR:
        return JSONResponse(status_code=500, content={"message": res.detail})
    return res.data
