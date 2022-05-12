from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from SmartHome.depends.auth import token_dep

from moduls_src.services import get
from castom_moduls.Zigbee.src.schemas import PermitJoin, ZigbeeDeviceSchema, RenameForm
from typing import Optional, List

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
async def reboot(auth_data: dict = Depends(token_dep)):
    get("Zigbee_ZigbeeCoordinator").reboot()
    return "ok"

@router.get("/permit_join/get", response_model=PermitJoin)
async def permit_join_get(auth_data: dict = Depends(token_dep)):
    return PermitJoin(state=get("Zigbee_ZigbeeInMessage").permit_join)

@router.post("/permit_join/set")
async def permit_join_set(data: PermitJoin, auth_data: dict = Depends(token_dep)):
    get("Zigbee_ZigbeeCoordinator").permission_join(data.state)
    return "ok"

@router.get("/device/all", response_model=List[ZigbeeDeviceSchema])
async def devices(auth_data: dict = Depends(token_dep)):
    return get("Zigbee_ZigbeeInMessage").getDevices()

@router.get("/device/delete/{address}")
async def device(address: str, auth_data: dict = Depends(token_dep)):
    get("Zigbee_ZigbeeCoordinator").zigbeeDeviceDelete(address)
    return "ok"

@router.post("/device/rename")
async def rename(data:RenameForm, auth_data: dict = Depends(token_dep)):
    get("Zigbee_ZigbeeCoordinator").zigbeeDeviceRename(data.name, data.newName)
    return "ok"
