from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from SmartHome.authtorization.auth_depends import token_dep

from moduls_src.services import get

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
async def gete(auth_data: dict = Depends(token_dep)):
    res = get("Mqtt_MqttConnect").getHistory().getTopicksAndLinc()
    if(res == None):
        return JSONResponse(status_code=400, content={"message": "unknown error"})
    return res

@router.get("/clear")
async def geter(auth_data: dict = Depends(token_dep)):
    get("Mqtt_MqttConnect").getHistory().clear()
    return "ok"
