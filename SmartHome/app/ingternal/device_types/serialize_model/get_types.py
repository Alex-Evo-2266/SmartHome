from app.ingternal.device_types.register_type import types
from app.ingternal.device_types.schemas.device_type import DeviceTypeSchema

from typing import List

def get_all_types():
    types_data:List[DeviceTypeSchema] = []
    for type_dev in types:
        types_data.append(DeviceTypeSchema(name=type_dev.name, field=type_dev.fields))
    return types_data
