from fastapi import APIRouter
from castom_moduls import init_routers

router_moduls = APIRouter(
    prefix="/api/module",
    responses={404: {"description": "Not found"}},
)

routers = init_routers()
for router in routers:
    router_moduls.include_router(router)
