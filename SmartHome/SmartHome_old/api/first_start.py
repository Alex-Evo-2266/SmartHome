from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.responses import JSONResponse
from typing import Optional
from SmartHome.schemas.server import FirstConfigSchema

from settings import configManager

router = APIRouter(
    prefix="/api/firststart",
    tags=["firststart"],
    responses={404: {"description": "Not found"}},
)

@router.post("")
async def firststart(data: FirstConfigSchema):
    try:
        print(data)
        await configManager.set("base", {
            "host":data.host,
            "clientId":data.clientId,
            "clientSecret":data.clientSecret
        })
        return JSONResponse(status_code=200, content="ok")
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})
