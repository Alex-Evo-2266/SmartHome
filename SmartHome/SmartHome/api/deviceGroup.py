from fastapi import APIRouter, Depends
from SmartHome.depends.auth import token_dep
from SmartHome.schemas.group import GroupSchema
from SmartHome.logic.groups.GroupFile import Groups
from fastapi.responses import JSONResponse
from SmartHome.schemas.device import DeviceValueSchema
from SmartHome.logic.groups.setValueGroup import setValueGroup
from SmartHome.schemas.base import FunctionRespons, TypeRespons
from typing import List

router_groups = APIRouter(
    prefix="/api/group",
    tags=["group"],
    responses={404: {"description": "Not found"}},
)

@router_groups.get("/all", response_model=List[GroupSchema])
async def get_group(auth_data: dict = Depends(token_dep)):
    groups = []
    for item in Groups.all():
        groups.append(item)
    return groups

@router_groups.get("/get/{name}", response_model=GroupSchema)
async def get_group(name: str, auth_data: dict = Depends(token_dep)):
    return Groups.get(name)

@router_groups.post("/add")
async def get_group(data:GroupSchema):
    res = Groups.create(data)
    if res:
        return "ok"
    return JSONResponse(status_code=400, content={"message": "error add group"})

@router_groups.post("/edit/{name}")
async def get_group(name: str, data:GroupSchema, auth_data: dict = Depends(token_dep)):
    group = Groups.get(name)
    if not group:
        return JSONResponse(status_code=404, content={"message": "not found"})
    group.name = data.name
    group.systemName = data.systemName
    group.devices = data.devices
    group.save()
    return "ok"

@router_groups.get("/delete/{name}")
async def get_group(name: str, auth_data: dict = Depends(token_dep)):
    group = Groups.get(name)
    if not group:
        return JSONResponse(status_code=404, content={"message": "not found"})
    group.delete()
    return "ok"

@router_groups.post("/value/set")
async def get_group(data:DeviceValueSchema, auth_data: dict = Depends(token_dep)):
    res = await setValueGroup(data)
    if res.status == TypeRespons.OK:
        return JSONResponse(status_code=200, content={"message": "ok"})
    if res.status == TypeRespons.INVALID:
        return JSONResponse(status_code=400, content={"message": res.detail})
    return JSONResponse(status_code=500, content={"message": res.detail})
