from fastapi import APIRouter, Depends
from app.modules.modules import init_routers

router_moduls = APIRouter(
    prefix="/api/module",
    responses={404: {"description": "Not found"}},
)

routers = init_routers()

for module in routers:
    print("p1", module, routers[module])
    for router in routers[module]:
        if isinstance(router, APIRouter):
            router_moduls.include_router(router)