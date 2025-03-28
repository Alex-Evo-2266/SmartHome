from app.ingternal.device_types.classes.BaseTypeClass import FieldDeviceType, DeviceType
from app.ingternal.device.schemas.enums import TypeDeviceField


types = [
    DeviceType(name_type="light", fields=[
        FieldDeviceType(name_field_type="power", type_field=TypeDeviceField.BINARY, required=True),
        FieldDeviceType(name_field_type="brightness", type_field=TypeDeviceField.NUMBER),
        FieldDeviceType(name_field_type="temp", type_field=TypeDeviceField.NUMBER),
        FieldDeviceType(name_field_type="mode", type_field=TypeDeviceField.BINARY),
        FieldDeviceType(name_field_type="color", type_field=TypeDeviceField.NUMBER),
        FieldDeviceType(name_field_type="sat", type_field=TypeDeviceField.NUMBER),
    ])
]