
from app.ingternal.device.device_class.BaseDeviceClass import BaseDevice
from app.ingternal.device.type_class.WithoutType import WithoutType
from app.ingternal.device.schemas.device_class import ConfigSchema, ChangeField
from typing import Any, TypeVar, List
import copy
from app.ingternal.device.enums import TypeDeviceField

T = TypeVar("T")

def look_for_param(arr:List[T], name:str)->T|None:
	for item in arr:
		if(item.name == name):
			return(item)
	return None

class Variable(BaseDevice):

	types = [WithoutType]

	class Config(ConfigSchema):
		class_img = "Variable/variable.png"
		fields_change: ChangeField = ChangeField(value=True, address=False)
		address: bool = False
		virtual = True
		
	def set_value(self, name:str, status1:Any):
		print(self.system_name)
		status = copy.copy(status1)
		value = look_for_param(self.values, name)
		print("P0",value)
		if(value):
			if(value.get_type() == TypeDeviceField.BINARY):
				if(status == "on"):
					status = value.get_high()
				if(status == "off"):
					status = value.get_low()
			if(value.get_type() == TypeDeviceField.NUMBER):
				if(int(status) > int(value.get_high())):
					status = value.get_high()
				if(int(status) < int(value.get_low())):
					status = value.get_low()
			value.set(status, True)
		return status