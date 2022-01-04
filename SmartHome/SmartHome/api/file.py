from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from SmartHome.schemas.image import ImageSchema
from typing import Optional, List
from SmartHome.depends.auth import token_dep
import shutil
from SmartHome.schemas.base import FunctionRespons
from SmartHome.settings import MEDIA_ROOT
from SmartHome.logic.gallery import getimageName, backgroundDelete, backgroundLinc

router = APIRouter(
    prefix="/api/file",
    tags=["file"],
    responses={404: {"description": "Not found"}},
)

@router.post("/background/load")
async def root(file: UploadFile = File(...), auth_data: dict = Depends(token_dep)):
    with open(MEDIA_ROOT + "/backgrounds/" + file.filename, 'wb') as buff:
        shutil.copyfileobj(file.file, buff)
    return "ok"

@router.get("/background/get", response_model=List[ImageSchema])
async def root(index: int, count: int = 10, auth_data: dict = Depends(token_dep)):
    arr = getimageName(index, count)
    return arr

@router.get("/background/delete/{name}")
async def root(name: str, auth_data: dict = Depends(token_dep)):
    res = backgroundDelete(name)
    if res.status == "ok":
        return "ok"
    return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/background/linc")
async def root(name: str, type: str = "base", auth_data: dict = Depends(token_dep)):
    res = await backgroundLinc(name, type, auth_data["user_id"])
    if res.status == "ok":
        return "ok"
    return JSONResponse(status_code=400, content={"message": res.detail})
