from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

from SmartHome.logic.auth import auth
from SmartHome.schemas.style import StyleSchemas, StyleDeleteSchemas
from SmartHome.depends.auth import token_dep
from SmartHome.logic.style import addstyle, getStyles, removeStyle

router = APIRouter(
    prefix="/api/style",
    tags=["style"],
    responses={404: {"description": "Not found"}},
)

@router.post("/add")
async def add(data: StyleSchemas, auth_data: dict = Depends(token_dep)):
    res = await addstyle(data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": "error add style"})
    return "ok"

@router.get("/all", response_model=List[StyleSchemas])
async def add(auth_data: dict = Depends(token_dep)):
    return await getStyles()

@router.post("/delete")
async def delete(data:StyleDeleteSchemas, auth_data: dict = Depends(token_dep)):
    res = await removeStyle(data.name)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": res['detail']})
    return "ok"
