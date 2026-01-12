from app.schemas.device.BaseTypeClass import DeviceType
from app.schemas.device.device_type import FieldDeviceTypeSchema
from app.schemas.device.types_names import TypesDeviceEnum
from app.schemas.device.enums import TypeDeviceField

device_type = DeviceType(name=TypesDeviceEnum.WINDOW, fields=[
        FieldDeviceTypeSchema(name_field_type="state", type_field=TypeDeviceField.BINARY, required=True, description=""),
])
