
from app.ingternal.device.device_class.BaseDeviceClass import BaseDevice
from app.ingternal.device.type_class.WithoutType import WithoutType
from app.ingternal.device.schemas.device_class import ConfigSchema, ChangeField

class Variable(BaseDevice):

	types = [WithoutType]

	class Config(ConfigSchema):
		class_img = "Variable/variable.png"
		fields_change: ChangeField = ChangeField(value=True, address=False)
		address: bool = False
		virtual = True
		
