

from app.device.type_class.BaseType import BaseType
from app.device.enums import TypeDeviceField


class Light(BaseType, page="fhmg"):
	power = TypeDeviceField.BINARY

