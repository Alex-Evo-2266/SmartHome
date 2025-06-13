from app.ingternal.device_types.classes.BaseTypeClass import DeviceType
from app.ingternal.device_types.schemas.device_type import FieldDeviceTypeSchema
from app.ingternal.device_types.types_names import TypesDeviceEnum
from app.ingternal.device.schemas.enums import TypeDeviceField

device_type = DeviceType(name=TypesDeviceEnum.LIGHT_DECO, fields=[
        FieldDeviceTypeSchema(name_field_type="power", type_field=TypeDeviceField.BINARY, required=True, description=""),
        FieldDeviceTypeSchema(name_field_type="brightness", type_field=TypeDeviceField.NUMBER),
        FieldDeviceTypeSchema(name_field_type="temp", type_field=TypeDeviceField.NUMBER),
        FieldDeviceTypeSchema(name_field_type="mode", type_field=TypeDeviceField.BINARY),
        FieldDeviceTypeSchema(name_field_type="color", type_field=TypeDeviceField.NUMBER),
        FieldDeviceTypeSchema(name_field_type="sat", type_field=TypeDeviceField.NUMBER),
])
