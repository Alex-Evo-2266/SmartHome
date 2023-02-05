

from SmartHome.logic.deviceClass.typeDevice.BaseType import BaseType
from SmartHome.logic.deviceClass.schema import FieldTypeDevice
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField


class Light(BaseType):
	power = TypeField.BINARY
