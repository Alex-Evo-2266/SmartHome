import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from typing import Callable, Awaitable, Any

from app.ingternal.room.schemas.room import (
    RoomCreate, RoomDevicesUpdate, RoomUpdate,
    RoomDevicesRaw, RoomDevicesRawList, RoomDevicesLink, RoomDevicesSet
)
from app.ingternal.room.serialize_model.room import (
    create_room, delete_room, update_device_room, update_room
)
from app.ingternal.room.serialize_model.get_room import get_room, get_room_all
from app.ingternal.room.serialize_model.device_in_room import room_add_device
from app.ingternal.room.set_value_room import set_value_room

router = APIRouter(
    prefix="/api-devices/rooms",
    tags=["room"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)


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
async def add_room_url(data: RoomCreate) -> JSONResponse:
    return await handle_request(lambda: create_room(data))


@router.delete("/{name}", response_model=dict)
async def delete_room_url(name: str) -> JSONResponse:
    return await handle_request(lambda: delete_room(name))


@router.patch("/{name}/devices", response_model=dict)
async def device_in_room_update_url(name: str, data: RoomDevicesUpdate) -> JSONResponse:
    return await handle_request(lambda: update_device_room(name, data))


@router.put("/{name}", response_model=dict)
async def update_room_url(name: str, data: RoomUpdate) -> JSONResponse:
    return await handle_request(lambda: update_room(name, data))


@router.get("/{name}", response_model=RoomDevicesRaw)
async def get_room_url(name: str) -> Any:
    try:
        return await get_room(name)
    except Exception as e:
        logger.warning(f"Get room error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.get("", response_model=RoomDevicesRawList)
async def all_room_url() -> Any:
    try:
        rooms = await get_room_all()
        return RoomDevicesRawList(rooms=rooms)
    except Exception as e:
        logger.warning(f"Get all rooms error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("/link_device", response_model=dict)
async def link_room(data: RoomDevicesLink) -> JSONResponse:
    return await handle_request(lambda: room_add_device(data.name_room, data.device))


@router.patch("/set/value", response_model=dict)
async def set_device_value_in_room(data: RoomDevicesSet) -> JSONResponse:
    return await handle_request(lambda: set_value_room(
        data.name_room, data.device_type, data.field_name, data.value
    ))
