from fastapi import APIRouter, Depends
from SmartHome.authtorization.auth_depends import token_dep
from SmartHome.schemas.room import getPages
from fastapi.responses import JSONResponse
from moduls_src.pages import Pages, LincDevice, LincDeviceOut
from typing import List

router_pages = APIRouter(
    prefix="/api/room",
    tags=["pages"],
    responses={404: {"description": "Not found"}},
)

@router_pages.get("/all", response_model=Pages)
async def get_room(name: str, auth_data: dict = Depends(token_dep)):
    pages = getPages()
    for item in pages:
        if item.name == name:
            print(item)
            return item
    return JSONResponse(status_code=404, content={"message": "Not found"})

@router_pages.get("/get/{name}", response_model=Pages)
async def get_room(name: str, auth_data: dict = Depends(token_dep)):
    pages = getPages()
    for item in pages:
        if item.name == name:
            print(item)
            return item
    return JSONResponse(status_code=404, content={"message": "Not found"})
