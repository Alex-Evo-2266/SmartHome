import logging
from fastapi import APIRouter, Depends

from typing import List, Dict

from .schemas import ConfigItem, ConfigRouterOption, DependFunction
from .config import Config

logger = logging.getLogger(__name__)

def get_router(__config__:Config, options: ConfigRouterOption):

    router = APIRouter(
        prefix=f"{options.prefix}/config",
        tags=[options.tag],
        responses={404: {"description": "Not found"}},
    )

    deps: DependFunction = DependFunction(
        get=options.depend_functions.get if options.depend_functions.get != None else options.depend_function,
        patch=options.depend_functions.patch if options.depend_functions.patch != None else options.depend_function
        )

    @router.get("", response_model=List[ConfigItem])
    async def get_config(user_id:None = Depends(deps.get)):
        return __config__.get_all_data()

    @router.patch("")
    async def set_config(data: Dict[str, str], user_id:None = Depends(deps.patch)):
        await __config__.set_dict(data)
        __config__.save()
        return "ok"
    
    return router