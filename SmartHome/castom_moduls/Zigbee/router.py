from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from SmartHome.depends.auth import token_dep

from .zigbeeCoordinatorManager import initManager, getManager as getControlManager
from .zigbeeInputMessage import getManager as getMessageManager
from .schemas import PermitJoin, ZigbeeDeviceSchema
from typing import Optional, List
from moduls_src.managers import add

router = APIRouter(
    prefix="/zigbee2mqtt",
    tags=["zigbee2mqtt"],
    responses={404: {"description": "Not found"}},
)

def routerInit():
    add("zigbeerouter",router)
    initManager()
    return "zigbeerouter"

@router.get("/reboot")
async def get(auth_data: dict = Depends(token_dep)):
    getControlManager().reboot()
    return "ok"

@router.get("/permit_join/get", response_model=PermitJoin)
async def get(auth_data: dict = Depends(token_dep)):
    return PermitJoin(state=getMessageManager().permit_join)

@router.get("/device/get", response_model=List[ZigbeeDeviceSchema])
async def get(auth_data: dict = Depends(token_dep)):
    return getMessageManager().getDevices()
