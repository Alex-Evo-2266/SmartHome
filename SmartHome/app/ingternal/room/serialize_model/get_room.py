from app.ingternal.room.models.room import Room
from typing import List
from app.ingternal.logs import get_room_logger
from app.ingternal.room.exceptions.room import RoomNotFoundException
from app.ingternal.room.schemas.room import RoomCreate, RoomDevicesRaw, RoomUpdate, RoomDevicesUpdate, DeviceRoom

logger = get_room_logger.get_logger(__name__)

async def get_room(name: str):
    try:
        room = await Room.objects.filter(name=name).prefetch_related('devices').get_or_none()
        if not room:
            logger.warning(f"Комната '{name}' не найдена.")
            raise RoomNotFoundException()
        devices_room = [
            DeviceRoom(system_name=x.system_name, poz=x.position_in_room)
            for x in room.devices
        ]
        logger.info(f"Комната '{name}' успешно получена.")
        return RoomDevicesRaw(name_room=room.name, devices=devices_room)
    except Exception as e:
        logger.exception("Ошибка при получении комнаты")
        raise


async def get_room_all():
    try:
        rooms = await Room.objects.prefetch_related('devices').all()
        rooms_data: List[RoomDevicesRaw] = []
        for room in rooms:
            devices_room = [
                DeviceRoom(system_name=x.system_name, poz=x.position_in_room)
                for x in room.devices
            ]
            rooms_data.append(RoomDevicesRaw(name_room=room.name, devices=devices_room))
        logger.info("Получены все комнаты.")
        return rooms_data
    except Exception as e:
        logger.exception("Ошибка при получении всех комнат")
        raise

async def is_room_exists(name: str) -> bool:
    return await Room.objects.filter(name=name).exists()