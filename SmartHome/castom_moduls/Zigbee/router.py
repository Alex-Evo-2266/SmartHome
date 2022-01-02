from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from SmartHome.depends.auth import token_dep

from .zigbeeCoordinatorManager import initManager, getManager as getControlManager
from .zigbeeInputMessage import getManager as getMessageManager
from .schemas import PermitJoin, ZigbeeDeviceSchema, RenameForm
from typing import Optional, List
from moduls_src.managers import add

router = APIRouter(
    prefix="/zigbee2mqtt",
    tags=["zigbee2mqtt"],
    responses={404: {"description": "Not found"}},
)

# def routerInit():
#     add("zigbeerouter",router)
#     initManager()
#     return "zigbeerouter"

@router.get("/reboot")
async def get(auth_data: dict = Depends(token_dep)):
    getControlManager().reboot()
    return "ok"

@router.get("/permit_join/get", response_model=PermitJoin)
async def pjoin(auth_data: dict = Depends(token_dep)):
    return PermitJoin(state=getMessageManager().permit_join)

@router.post("/permit_join/set")
async def pjoin(data: PermitJoin, auth_data: dict = Depends(token_dep)):
    getControlManager().permission_join(data.state)
    return "ok"

@router.get("/device/all", response_model=List[ZigbeeDeviceSchema])
async def device(auth_data: dict = Depends(token_dep)):
    return getMessageManager().getDevices()

@router.get("/device/delete/{address}")
async def device(address: str, auth_data: dict = Depends(token_dep)):
    getControlManager().zigbeeDeviceDelete(address)
    return "ok"

@router.post("/device/rename")
async def rename(data:RenameForm, auth_data: dict = Depends(token_dep)):
    getControlManager().zigbeeDeviceRename(data.name, data.newName)
    return "ok"
