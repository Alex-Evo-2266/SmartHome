from fastapi import APIRouter
from castom_moduls import init_routers
from moduls_src.managers import add, get

router_moduls = APIRouter(
    prefix="/api/module",
    responses={404: {"description": "Not found"}},
)
routers = init_routers()
for routername in routers:
    router = get(routername)
    if isinstance(router, APIRouter):
        router_moduls.include_router(router)
