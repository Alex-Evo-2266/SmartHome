from app.core.ports.interface.field_class import IField
from app.schemas.device.device import DeviceSerializeFieldSchema
from app.schemas.device.enums import TypeDeviceField
from app.core.entities.device.field.types.binaryField import BinaryField
from app.core.entities.device.field.types.enumField import EnumField
from app.core.entities.device.field.types.numberField import NumberField
from app.core.entities.device.baseField import FieldBase

def createField(field: DeviceSerializeFieldSchema, device_system_name: str, room: str)->IField:
    match field.type:
        case TypeDeviceField.BINARY:
            return BinaryField(field, device_system_name, room)
        case TypeDeviceField.NUMBER:
            return NumberField(field, device_system_name, room)
        case TypeDeviceField.ENUM:
            return EnumField(field, device_system_name, room)
        case _:
            return FieldBase(field, device_system_name, room)