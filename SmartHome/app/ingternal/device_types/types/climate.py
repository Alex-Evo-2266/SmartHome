from app.ingternal.device_types.classes.BaseTypeClass import DeviceType
from app.ingternal.device_types.schemas.device_type import FieldDeviceTypeSchema
from app.ingternal.device_types.types_names import TypesDeviceEnum
from app.ingternal.device.schemas.enums import TypeDeviceField

device_type = DeviceType(name=TypesDeviceEnum.CLIMATE, fields=[
    FieldDeviceTypeSchema(name_field_type="temp", type_field=TypeDeviceField.NUMBER),
    FieldDeviceTypeSchema(name_field_type="heat", type_field=TypeDeviceField.BINARY),
    FieldDeviceTypeSchema(name_field_type="cool", type_field=TypeDeviceField.BINARY),
])
