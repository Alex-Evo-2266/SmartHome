from app.ingternal.room.models.room import Room
from app.ingternal.room.schemas.room import RoomCreate, RoomDevicesRaw, RoomUpdate, RoomDevicesUpdate, DeviceRoom
from app.ingternal.room.exceptions.room import RoomNotFoundException
from app.ingternal.device.models.device import Device
from typing import List
from app.ingternal.logs import get_room_logger

logger = get_room_logger.get_logger(__name__)


async def create_room(data: RoomCreate):
    try:
        existing = await Room.objects.get_or_none(name=data.name_room)
        if existing:
            logger.warning(f"Комната с именем '{data.name_room}' уже существует.")
            raise ValueError(f"Комната '{data.name_room}' уже существует.")
        await Room.objects.create(name=data.name_room)
        logger.info(f"Комната '{data.name_room}' успешно создана.")
    except Exception as e:
        logger.exception("Ошибка при создании комнаты")
        raise


async def delete_room(name: str):
    try:
        deleted_count = await Room.objects.filter(name=name).delete()
        if deleted_count:
            logger.info(f"Комната '{name}' успешно удалена.")
        else:
            logger.warning(f"Комната '{name}' не найдена для удаления.")
    except Exception as e:
        logger.exception("Ошибка при удалении комнаты")
        raise


async def create_device_link(devices: List[str], room: Room):
    try:
        device_keys = set(devices)  # убрать дубликаты
        existing_devices = await Device.objects.filter(system_name__in=device_keys).all()
        existing_keys = {d.system_name for d in existing_devices}

        missing_keys = device_keys - existing_keys
        if missing_keys:
            logger.warning(f"Некоторые устройства не найдены и будут проигнорированы: {missing_keys}")

        await Device.objects.filter(system_name__in=existing_keys).update(room=room)
        logger.info(f"Связи с комнатой '{room.name}' успешно созданы для устройств: {existing_keys}")
    except Exception as e:
        logger.exception("Ошибка при создании связей устройств")
        raise


async def delete_device_link(room: Room):
    try:
        await Device.objects.filter(room=room).update(room=None)
        logger.info(f"Связи устройств с комнатой '{room.name}' успешно удалены.")
    except Exception as e:
        logger.exception("Ошибка при удалении связей устройств")
        raise


async def update_device_room(name: str, data: RoomDevicesUpdate):
    try:
        room = await Room.objects.get_or_none(name=name)
        if not room:
            logger.warning(f"Комната '{name}' не найдена при обновлении устройств.")
            raise RoomNotFoundException()
        await delete_device_link(room)
        await create_device_link(data.devices, room)
        logger.info(f"Устройства комнаты '{name}' успешно обновлены.")
    except Exception as e:
        logger.exception("Ошибка при обновлении устройств комнаты")
        raise


async def update_room(name: str, data: RoomUpdate):
    try:
        await Room.objects.filter(name=name).update(name=data.name_room)
        logger.info(f"Комната '{name}' переименована в '{data.name_room}'.")
    except Exception as e:
        logger.exception("Ошибка при обновлении комнаты")
        raise


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