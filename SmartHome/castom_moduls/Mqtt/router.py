from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from SmartHome.depends.auth import token_dep

from .mqttConnect import getManager

router = APIRouter(
    prefix="/mqtt",
    tags=["mqtt"],
    responses={404: {"description": "Not found"}},
)

from moduls_src.managers import add

# def routerInit():
#     add("mqttrouter",router)
#     return "mqttrouter"

@router.get("/get")
async def get(auth_data: dict = Depends(token_dep)):
    res = getManager().getHistory().getTopicksAndLinc()
    if(res == None):
        return JSONResponse(status_code=400, content={"message": "unknown error"})
    return res

@router.get("/clear")
async def get(auth_data: dict = Depends(token_dep)):
    getManager().getHistory().clear()
    return "ok"
