# from app.ingternal.room.models.room import Room
# from typing import List, Dict, Tuple
# from app.ingternal.logs import get_room_logger
# from app.ingternal.room.exceptions.room import RoomNotFoundException
# from app.ingternal.room.schemas.room import RoomDevicesRaw, DeviceRoom
# from app.ingternal.device_types.serialize_model.read import get_type_device
# from app.ingternal.device_types.exceptions.device_type import DeviceTypeNotFound
# from app.ingternal.room.schemas.type_device import DeviceField, DeviceFieldType, DeviceTypeModel

# logger = get_room_logger.get_logger(__name__)

# async def get_room(name: str):
# 	try:
# 		room = await Room.objects.filter(name=name).prefetch_related('devices').get_or_none()
# 		if not room:
# 			logger.warning(f"Комната '{name}' не найдена.")
# 			raise RoomNotFoundException()
# 		devices_room = [
# 			DeviceRoom(system_name=x.system_name, poz=x.position_in_room)
# 			for x in room.devices
# 		]
# 		logger.info(f"Комната '{name}' успешно получена.")
# 		return RoomDevicesRaw(name_room=room.name, devices=devices_room)
# 	except Exception as e:
# 		logger.exception("Ошибка при получении комнаты")
# 		raise

# async def get_room_all():
#     try:
#         rooms = await Room.objects.prefetch_related('devices').all()
#         rooms_data: List[RoomDevicesRaw] = []

#         for room in rooms:
#             types: Dict[str, DeviceTypeModel] = {}

#             for x in room.devices:
#                 try:
#                     _types = await get_type_device(x.system_name)
#                 except DeviceTypeNotFound:
#                     continue

#                 for t in _types:
#                     if t.name_type not in types:
#                         types[t.name_type] = DeviceTypeModel()

#                     device_type_model = types[t.name_type]
#                     if t.fields is None:
#                         continue

#                     for f in t.fields:
#                         if f.name_field_type not in device_type_model.fields:
#                             device_type_model.fields[f.name_field_type] = DeviceFieldType(
#                                 field_type=f.field_type,
#                                 devices=[]
#                             )
#                         device_type_model.fields[f.name_field_type].devices.append(
#                             DeviceField(
#                                 system_name=x.system_name,
#                                 id_field_device=f.id_field_device
#                             )
#                         )

#             devices_room = [
#                 DeviceRoom(system_name=x.system_name, poz=x.position_in_room)
#                 for x in room.devices
#             ]
#             rooms_data.append(
#                 RoomDevicesRaw(
#                     name_room=room.name,
#                     devices=devices_room,
#                     device_room=types
#                 )
#             )

#         logger.info("Получены все комнаты.")
#         return rooms_data

#     except Exception:
#         logger.exception("Ошибка при получении всех комнат")
#         raise


# async def is_room_exists(name: str) -> bool:
# 	return await Room.objects.filter(name=name).exists()



from typing import List, Dict
from app.ingternal.room.models.room import Room
from app.ingternal.logs import get_room_logger
from app.ingternal.room.exceptions.room import RoomNotFoundException
from app.ingternal.room.schemas.room import RoomDevicesRaw, DeviceRoom
from app.ingternal.device_types.serialize_model.read import get_type_device
from app.ingternal.device_types.exceptions.device_type import DeviceTypeNotFound
from app.ingternal.room.schemas.type_device import DeviceField, DeviceFieldType, DeviceTypeModel

logger = get_room_logger.get_logger(__name__)


async def build_device_types(devices) -> Dict[str, DeviceTypeModel]:
    """
    Строит словарь типов устройств и их полей.
    Ключ: имя типа устройства (str)
    Значение: DeviceTypeModel с полями и списком устройств.
    """
    types: Dict[str, DeviceTypeModel] = {}

    for device in devices:
        try:
            device_types = await get_type_device(device.system_name)
        except DeviceTypeNotFound:
            # Пропускаем устройство, если его тип не найден
            continue

        for device_type in device_types:
            # Создаем модель типа устройства, если ее ещё нет
            if device_type.name_type not in types:
                types[device_type.name_type] = DeviceTypeModel()

            device_type_model = types[device_type.name_type]

            # Пропускаем, если у типа нет полей
            if device_type.fields is None:
                continue

            # Заполняем поля для каждого устройства
            for field in device_type.fields:
                if field.name_field_type not in device_type_model.fields:
                    device_type_model.fields[field.name_field_type] = DeviceFieldType(
                        field_type=field.field_type,
                        readonly=field.readOnly,
                        devices=[]
                    )
                device_type_model.fields[field.name_field_type].devices.append(
                    DeviceField(
                        system_name=device.system_name,
                        id_field_device=field.id_field_device,
                    )
                )

    return types


def build_device_rooms(devices) -> List[DeviceRoom]:
    """
    Преобразует список устройств комнаты в список DeviceRoom.
    """
    return [
        DeviceRoom(system_name=device.system_name, poz=device.position_in_room)
        for device in devices
    ]


async def get_room(name: str) -> RoomDevicesRaw:
    """
    Возвращает данные о комнате по имени.
    Если комната не найдена — генерирует RoomNotFoundException.
    """
    try:
        logger.info(f"Запрос комнаты имя = '{name}'")
        room = await Room.objects.filter(name=name).prefetch_related('devices').get_or_none()
        if not room:
            logger.warning(f"Комната '{name}' не найдена.")
            raise RoomNotFoundException()

        types = await build_device_types(room.devices)
        devices_room = build_device_rooms(room.devices)
        
        logger.info(f"Комната '{name}' успешно получена.")
        return RoomDevicesRaw(name_room=room.name, devices=devices_room, device_room=types)

    except Exception:
        logger.exception("Ошибка при получении комнаты")
        raise


async def get_room_all() -> List[RoomDevicesRaw]:
    """
    Возвращает список всех комнат с устройствами и их типами.
    """
    try:
        rooms = await Room.objects.prefetch_related('devices').all()
        rooms_data: List[RoomDevicesRaw] = []

        for room in rooms:
            types = await build_device_types(room.devices)
            devices_room = build_device_rooms(room.devices)

            rooms_data.append(
                RoomDevicesRaw(
                    name_room=room.name,
                    devices=devices_room,
                    device_room=types
                )
            )

        logger.info("Получены все комнаты.")
        return rooms_data

    except Exception:
        logger.exception("Ошибка при получении всех комнат")
        raise


async def is_room_exists(name: str) -> bool:
    """
    Проверяет, существует ли комната с указанным именем.
    """
    return await Room.objects.filter(name=name).exists()
