from fastapi import APIRouter, Depends
from castom_moduls import init_routers
from moduls_src.managers import add, get

router_moduls = APIRouter(
    prefix="/api/module",
    responses={404: {"description": "Not found"}},
)
routers = init_routers()
for router in routers:
    if isinstance(router, APIRouter):
        router_moduls.include_router(router)
