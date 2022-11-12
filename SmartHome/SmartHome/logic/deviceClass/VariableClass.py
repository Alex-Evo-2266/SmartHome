from SmartHome.logic.deviceClass.schema import ChangeField
from SmartHome.logic.deviceClass.DeviceMeta import DefConfig
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice

class Variable(BaseDevice):

	class Config(DefConfig):
		fields_change: ChangeField = ChangeField(value=True, address=False)
		address: bool = False

	@property
	def is_conected(self):
		return bool(self.device)
