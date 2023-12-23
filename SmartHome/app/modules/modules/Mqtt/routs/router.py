from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.ingternal.authtorization.depends.authtorization import token_dep
from ..src.TopicMessagesList import TopicMessagesList

from app.modules.modules_src.services import Services
from ..settings import ROUTE_PREFIX

router = APIRouter(
    prefix="/" + ROUTE_PREFIX,
    tags=[ROUTE_PREFIX],
    responses={404: {"description": "Not found"}},
)


# def routerInit():
#     add("mqttrouter",router)
#     return "mqttrouter"

@router.get("/get")
async def gete(auth_data: dict = Depends(token_dep)):
    res = TopicMessagesList.get_topicks_and_linc()
    if(res == None):
        return JSONResponse(status_code=400, content={"message": "unknown error"})
    return res

@router.get("/clear")
async def geter(auth_data: dict = Depends(token_dep)):
    TopicMessagesList.clear()
    return "ok"
