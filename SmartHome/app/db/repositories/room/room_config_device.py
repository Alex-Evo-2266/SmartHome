from collections import defaultdict
from app.db.models.device.device import Device, DeviceField
from app.db.models.device.device_type import TypeDevice, FieldTypeDevice
from app.db.models.room.room import Room

async def get_room():
    result = []

    # Получаем комнаты и связанные устройства с полями
    rooms = await Room.objects.select_related("devices__fields").all()

    # Получаем все типы устройств сразу
    type_devices = await TypeDevice.objects.select_related("fields").all()

    # Группируем типы по system_name устройства
    types_by_device = defaultdict(list)
    for td in type_devices:
        types_by_device[td.device].append(td)

    for room in rooms:
        room_entry = {
            "room_name": room.name,
            "devices": defaultdict(lambda: defaultdict(list))
        }

        for device in room.devices:
            if not device.fields:
                continue

            # Получаем все типы для данного устройства
            device_types = types_by_device.get(device.system_name, [])

            for td in device_types:
                for field_type in td.fields:
                    # Найти поле в device.fields, которое соответствует id_field_device
                    for field in device.fields:
                        if field.id == field_type.id_field_device:
                            type_name:str = td.name_type
                            field_type_name = field_type.name_field_type
                            type_name = type_name.lower()

                            room_entry["devices"][type_name][field_type_name].append({
                                "device_name": device.name,
                                "field_name": field.name,
                                "field_id": field.id
                            })

        # Добавляем только если что-то найдено
        if room_entry["devices"]:
            result.append(room_entry)

    # Преобразуем defaultdict в обычный dict
    def convert(obj):
        if isinstance(obj, defaultdict):
            obj = {k: convert(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            obj = [convert(item) for item in obj]
        return obj

    for room in result:
        room["devices"] = convert(room["devices"])

    return result
