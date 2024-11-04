from app.internal.pages.logic.modulesArray import ModulesArray
from fastapi import APIRouter
from app.configuration.settings import ROUTE_PREFIX

def f(data):
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
    
    ModulesArray.initModules(__name__)
    routers2 = ModulesArray.routers()
    for r in routers2:
        router.include_router(r)
    return router

def getModule():
    ModulesArray.initModules(__name__)
    ModulesArray.start()
    ModulesArray.forEtch(f)
