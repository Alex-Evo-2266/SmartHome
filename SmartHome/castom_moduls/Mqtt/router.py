from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from SmartHome.depends.auth import token_dep

from .mqttConnect import mqttManager

router = APIRouter(
    prefix="/mqtt",
    tags=["mqtt"],
    responses={404: {"description": "Not found"}},
)

@router.get("/get")
async def get(auth_data: dict = Depends(token_dep)):
    res = mqttManager.getHistory().getTopicksAndLinc()
    if(res == None):
        return JSONResponse(status_code=400, content={"message": "unknown error"})
    return res

@router.get("/clear")
async def get(auth_data: dict = Depends(token_dep)):
    mqttManager.getHistory().clear()
    return "ok"
