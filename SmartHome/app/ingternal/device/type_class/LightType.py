

from app.ingternal.device.type_class.BaseType import BaseType
from app.ingternal.device.enums import TypeDeviceField


class Light(BaseType, page="fhmg"):
	power = TypeDeviceField.BINARY

