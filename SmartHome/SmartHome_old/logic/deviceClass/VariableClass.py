from SmartHome.logic.deviceClass.typeDevice.VariableType import Variable as TypeVariable
from SmartHome.logic.deviceClass.schema import ChangeField
from SmartHome.logic.deviceClass.DeviceMeta import ConfigSchema
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice

class Variable(BaseDevice):

	types = [TypeVariable]

	class Config(ConfigSchema):
		fields_change: ChangeField = ChangeField(value=True, address=False)
		address: bool = False
