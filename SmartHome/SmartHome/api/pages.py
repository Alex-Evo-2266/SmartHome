from fastapi import APIRouter, Depends
from SmartHome.depends.auth import token_dep
from castom_moduls import getPages

router_pages = APIRouter(
    prefix="/api/page",
    tags=["pages"],
    responses={404: {"description": "Not found"}},
)

@router_pages.get("/get/{name}")
async def all(name: str, auth_data: dict = Depends(token_dep)):
    print(name)
    pages = getPages()
    print(pages)
    for item in pages:
        if item.name == name:
            return item
    return"ok"

@router_pages.get("/all")
async def all():
    getPages()
    return"ok"
