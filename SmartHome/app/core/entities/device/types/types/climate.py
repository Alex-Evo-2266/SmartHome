from app.schemas.device.BaseTypeClass import DeviceType
from app.schemas.device.device_type import FieldDeviceTypeSchema
from app.schemas.device.types_names import TypesDeviceEnum
from app.schemas.device.enums import TypeDeviceField

device_type = DeviceType(name=TypesDeviceEnum.CLIMATE, fields=[
    FieldDeviceTypeSchema(name_field_type="temp", type_field=TypeDeviceField.NUMBER),
    FieldDeviceTypeSchema(name_field_type="heat", type_field=TypeDeviceField.BINARY),
    FieldDeviceTypeSchema(name_field_type="cool", type_field=TypeDeviceField.BINARY),
])
