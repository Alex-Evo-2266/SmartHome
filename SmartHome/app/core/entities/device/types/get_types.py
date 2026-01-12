from app.core.entities.device.types.register_type import types
from app.schemas.device.device_type import DeviceTypeSchema

from typing import List

def get_all_types():
    types_data:List[DeviceTypeSchema] = []
    for type_dev in types:
        types_data.append(DeviceTypeSchema(name=type_dev.name, field=type_dev.fields))
    return types_data

def get_device_type_by_name(name: str):
    for device_type in types:
        if device_type.name == name:
            return device_type
    return None