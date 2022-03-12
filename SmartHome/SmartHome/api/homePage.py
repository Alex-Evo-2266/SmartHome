from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict

from SmartHome.schemas.homePage import HomePage
from SmartHome.logic.homePage import getPage, setPage, addHomePage, deleteHomePage
from SmartHome.logic.user import setActivePage

from SmartHome.depends.auth import token_dep

router = APIRouter(
    prefix="/api/homePage",
    tags=["homePage"],
    responses={404: {"description": "Not found"}},
)

@router.get("/get/{name}", response_model=HomePage)
async def get(name:str, auth_data: dict = Depends(token_dep)):
    res = getPage(name)
    if res.status == "ok":
        return res.data
    return JSONResponse(status_code=400, content={"message": res.ditail})

@router.post("/set")
async def set(data:HomePage, auth_data: dict = Depends(token_dep)):
    res = setPage(data)
    if res.status == "ok":
        return "ok"
    return JSONResponse(status_code=400, content={"message": res.ditail})

@router.get("/add")
async def set(name:str, auth_data: dict = Depends(token_dep)):
    res = addHomePage(name)
    if res.status != "ok":
        return JSONResponse(status_code=400, content={"message": res.ditail})
    res = await setActivePage(name, auth_data['user_id'])
    if res['status'] != "ok":
        return JSONResponse(status_code=400, content={"message": res["detail"]})
    return "ok"

@router.get("/delete")
async def set(name:str, auth_data: dict = Depends(token_dep)):
    res = deleteHomePage(name)
    if res.status != "ok":
        return JSONResponse(status_code=400, content={"message": res.ditail})
    res = await setActivePage("basePage", auth_data['user_id'])
    if res['status'] != "ok":
        return JSONResponse(status_code=400, content={"message": res["detail"]})
    return "ok"
