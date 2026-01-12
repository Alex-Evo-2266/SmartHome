from app.schemas.device.BaseTypeClass import DeviceType
from app.schemas.device.device_type import FieldDeviceTypeSchema
from app.schemas.device.types_names import TypesDeviceEnum
from app.schemas.device.enums import TypeDeviceField

device_type = DeviceType(name=TypesDeviceEnum.SWITCH, fields=[
        FieldDeviceTypeSchema(name_field_type="state1", type_field=TypeDeviceField.BINARY, required=True, description=""),
        FieldDeviceTypeSchema(name_field_type="state2", type_field=TypeDeviceField.BINARY, description=""),
        FieldDeviceTypeSchema(name_field_type="state3", type_field=TypeDeviceField.BINARY, description=""),
        FieldDeviceTypeSchema(name_field_type="action", type_field=TypeDeviceField.ENUM),
])
