import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Callable, Awaitable, Any
from app.pkg.deps.auth import auth_privilege_dep
from app.pkg.logger import MyLogger

from app.schemas.room.room import (
    RoomCreate, RoomDevicesUpdate, RoomUpdate,
    RoomDevicesRaw, RoomDevicesRawList, RoomDevicesLink, RoomDevicesSet
)
from app.db.repositories.room.room import (
    create_room, delete_room, update_device_room, update_room
)
from app.db.repositories.room.get_room import get_room, get_room_all
from app.db.repositories.room.device_in_room import room_add_device
from app.core.entities.room.set_value_room import set_value_room
from app.core.state.get_store import get_container

router = APIRouter(
    prefix="/api-devices/rooms",
    tags=["room"],
    responses={404: {"description": "Not found"}},
)

logger = MyLogger().get_logger(__name__)


async def handle_request(action: Callable[[], Awaitable[Any]]) -> JSONResponse:
    """
    Универсальный обработчик запросов для сокращения дублирования try/except.
    Возвращает JSONResponse с кодом 200 или 400 при ошибке.
    """
    try:
        result = await action()
        return JSONResponse(status_code=200, content={"message": "ok"} if result is None else result)
    except Exception as e:
        logger.warning(f"Request error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("", response_model=dict)
async def add_room_url(data: RoomCreate, user_id:str=Depends(auth_privilege_dep("room"))) -> JSONResponse:
    return await handle_request(lambda: create_room(data))


@router.delete("/{name}", response_model=dict)
async def delete_room_url(name: str, user_id:str=Depends(auth_privilege_dep("room"))) -> JSONResponse:
    return await handle_request(lambda: delete_room(name))


@router.patch("/{name}/devices", response_model=dict)
async def device_in_room_update_url(name: str, data: RoomDevicesUpdate, user_id:str=Depends(auth_privilege_dep("room"))) -> JSONResponse:
    return await handle_request(lambda: update_device_room(name, data))


@router.put("/{name}", response_model=dict)
async def update_room_url(name: str, data: RoomUpdate, user_id:str=Depends(auth_privilege_dep("room"))) -> JSONResponse:
    return await handle_request(lambda: update_room(name, data))


@router.get("/{name}", response_model=RoomDevicesRaw)
async def get_room_url(name: str, user_id:str=Depends(auth_privilege_dep("room"))) -> Any:
    try:
        return await get_room(name)
    except Exception as e:
        logger.warning(f"Get room error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.get("", response_model=RoomDevicesRawList)
async def all_room_url(user_id:str=Depends(auth_privilege_dep("room"))) -> Any:
    try:
        rooms = await get_room_all()
        return RoomDevicesRawList(rooms=rooms)
    except Exception as e:
        logger.warning(f"Get all rooms error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("/link_device", response_model=dict)
async def link_room(data: RoomDevicesLink, user_id:str=Depends(auth_privilege_dep("room"))) -> JSONResponse:
    return await handle_request(lambda: room_add_device(data.name_room, data.device))


@router.patch("/set/value", response_model=dict)
async def set_device_value_in_room(data: RoomDevicesSet, user_id:str=Depends(auth_privilege_dep("room"))) -> JSONResponse:
    return await handle_request(lambda: set_value_room(
        data.name_room, data.device_type, data.field_name, data.value
    ))

@router.get("/test/eee")
async def test(user_id:str=Depends(auth_privilege_dep("room"))) -> Any:
    try:
        rooms = get_container().room_store.all()
        print("p9999", rooms)
        return rooms
    except Exception as e:
        logger.warning(f"Get all rooms error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})
