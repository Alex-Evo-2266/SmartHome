from app.ingternal.room.models.room import Room, Room_Device
from app.ingternal.room.schemas.room import RoomCreate, RoomDevciesRaw, RoomUpdate, RoomDevciesUpdate
from app.ingternal.room.exceptions.room import RoomNotFoundException

from app.ingternal.device.models.device import Device
from typing import List
from uuid import uuid4
import asyncio
from app.ingternal.logs import get_room_logger

logger = get_room_logger.get_logger(__name__)

def create_id():
    return str(uuid4().hex)

async def create_room(data: RoomCreate):
    try:
        await Room.objects.create(name=data.name_room)
    except Exception as e:
        print("Ошибка при создании комнаты:", e)

async def delete_room(name: str):
    try:
        await Room.objects.filter(name=name).delete()
    except Exception as e:
        print("Ошибка при удалении комнаты:", e)

async def create_device_link(devices: List[str], room: Room):
    try:
        device_keys = list(set(devices))  # убрать дубликаты

        # Получаем существующие устройства
        existing_devices = await Device.objects.filter(system_name__in=device_keys).all()
        existing_keys = {d.system_name for d in existing_devices}

        # Находим отсутствующие
        missing_keys = set(device_keys) - existing_keys
        if missing_keys:
            logger.warning(f"Некоторые устройства не найдены и будут проигнорированы: {missing_keys}")

        # Создаём связи только для существующих устройств
        await asyncio.gather(*[
            Room_Device.objects.create(id=create_id(), room=room, device=device)
            for device in existing_devices
        ])
    except Exception as e:
        logger.exception("Ошибка при создании связей устройств")

async def delete_device_link(room: Room):
    try:
        await Room_Device.objects.filter(room=room).delete()
    except Exception as e:
        print("Ошибка при удалении связей устройств:", e)

async def update_device_room(name:str, data: RoomDevciesUpdate):
    try:
        room = await Room.objects.get_or_none(name=name)
        if not room:
            raise RoomNotFoundException()
        await delete_device_link(room)
        await create_device_link(data.devices, room)
    except Exception as e:
        print("Ошибка при обновлении устройств комнаты:", e)


async def update_room(name:str, data: RoomUpdate):
    try:
        await Room.objects.filter(name=name).update(name=data.name_room)
    except Exception as e:
        print("Ошибка при обновлении комнаты:", e)


async def get_room(name: str):
    try:
        room = await Room.objects.get_or_none(name=name)
        if not room:
            raise RoomNotFoundException()
        device_in_room: List[Room_Device] = await Room_Device.objects.filter(room=room).all()
        device_keys = [x.device.system_name for x in device_in_room]
        return RoomDevciesRaw(name_room=room.name, devices=device_keys)
    except Exception as e:
        print("Ошибка при получении комнаты:", e)

async def get_room_all():
    try:
        rooms = await Room.objects.all()
        rooms_date:List[Room] = []
        for room in rooms:

            device_in_room: List[Room_Device] = await Room_Device.objects.filter(room=room).all()
            device_keys = [x.device.system_name for x in device_in_room]
            rooms_date.append(RoomDevciesRaw(name_room=room.name, devices=device_keys))
        return rooms_date
    except Exception as e:
        print("Ошибка при получении комнаты:", e)
