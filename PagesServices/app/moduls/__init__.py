from app.internal.pages.logic.modulesArray import ModulesArray
from fastapi import APIRouter
from app.configuration.settings import ROUTE_PREFIX
from typing import Type
from app.internal.pages.classes.BaseModules import BaseModule

def f(data: Type[BaseModule]):
    print(data)
    print(data.pages_path)
    print(data.dialogs_path)
    print(data.menu_path)
    print(data.router)

def routers():
    router = APIRouter(
        prefix=f"{ROUTE_PREFIX}/api",
        tags=["module"],
        responses={404: {"description": "Not found"}},
    )
    
    ModulesArray.init_modules(__name__)
    routers2 = ModulesArray.routers()
    for r in routers2:
        router.include_router(r)
    return router

def getModule():
    ModulesArray.init_modules(__name__)
    ModulesArray.start()
    ModulesArray.for_each(f)
