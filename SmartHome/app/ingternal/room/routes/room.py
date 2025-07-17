import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.ingternal.room.schemas.room import RoomCreate, RoomDevicesUpdate, RoomUpdate, RoomDevicesRaw, RoomDevciesRawList, RoomDevicesLink
from app.ingternal.room.serialize_model.room import create_room, delete_room, update_device_room, update_room
from app.ingternal.room.serialize_model.get_room import get_room, get_room_all
from app.ingternal.room.serialize_model.device_in_room import room_add_device

router = APIRouter(
    prefix="/api-devices/rooms",
    tags=["room"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# Добавление комнаты
@router.post("")
async def add_room_url(data: RoomCreate):
    try:
        await create_room(data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.delete("/{name}")
async def delete_room_url(name:str):
    try:
        await delete_room(name)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.patch("/{name}/devices")
async def device_in_room_update_url(name:str, data: RoomDevicesUpdate):
    try:
        await update_device_room(name, data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.put("/{name}")
async def update_room_url(name:str, data: RoomUpdate):
    try:
        await update_room(name, data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.get("/{name}", response_model=RoomDevicesRaw)
async def get_room_url(name:str):
    try:
        return await get_room(name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.get("", response_model=RoomDevciesRawList)
async def all_room_url():
    try:
        rooms = await get_room_all()
        return RoomDevciesRawList(rooms=rooms)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.post("/link_device")
async def link_room(data:RoomDevicesLink):
    try:
        await room_add_device(data.name_room, data.device)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})