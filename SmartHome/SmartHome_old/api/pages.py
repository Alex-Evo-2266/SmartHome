from fastapi import APIRouter, Depends
from SmartHome.authtorization.auth_depends import token_dep
from castom_moduls import getPages
from fastapi.responses import JSONResponse
from moduls_src.pages import Pages, LincDevice, LincDeviceOut
from typing import List

router_pages = APIRouter(
    prefix="/api/page",
    tags=["pages"],
    responses={404: {"description": "Not found"}},
)

@router_pages.get("/get/{name}", response_model=Pages, response_model_exclude={"linc"})
async def all(name: str, auth_data: dict = Depends(token_dep)):
    pages = getPages()
    for item in pages:
        if item.name == name:
            print(item)
            return item
    return JSONResponse(status_code=404, content={"message": "Not found"})

@router_pages.post("/linc/device/{namePage}", response_model=LincDeviceOut)
async def all(namePage: str, device:LincDevice, auth_data: dict = Depends(token_dep)):
    pages = getPages()
    for item in pages:
        if item.name == namePage and item.linc:
            out = item.linc(device)
            return out
    return JSONResponse(status_code=404, content={"message": "Not found"})

@router_pages.get("/all", response_model=List[str])
async def all(auth_data: dict = Depends(token_dep)):
    pages = getPages()
    arr = []
    for item in pages:
        arr.append(item.name)
    return arr
