from app.schemas.device.BaseTypeClass import DeviceType
from app.schemas.device.device_type import FieldDeviceTypeSchema
from app.schemas.device.types_names import TypesDeviceEnum
from app.schemas.device.enums import TypeDeviceField

device_type = DeviceType(name=TypesDeviceEnum.LIGHT, fields=[
        FieldDeviceTypeSchema(name_field_type="power", type_field=TypeDeviceField.BINARY, required=True, description=""),
        FieldDeviceTypeSchema(name_field_type="brightness", type_field=TypeDeviceField.NUMBER),
        FieldDeviceTypeSchema(name_field_type="temp", type_field=TypeDeviceField.NUMBER),
        FieldDeviceTypeSchema(name_field_type="mode", type_field=TypeDeviceField.BINARY),
        FieldDeviceTypeSchema(name_field_type="color", type_field=TypeDeviceField.NUMBER),
        FieldDeviceTypeSchema(name_field_type="sat", type_field=TypeDeviceField.NUMBER),
])
