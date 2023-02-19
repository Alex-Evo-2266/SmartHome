from typing import List
from SmartHome.logic.deviceFile.schema import DeviceFieldSchema, DeviceSchema
import logging

logger = logging.getLogger(__name__)

class IGetDeviceData():
	"""interface for receiving device data."""

	def get_value(self, name:str)->DeviceFieldSchema | None:
		pass

	def get_values(self)->List[DeviceFieldSchema] | None:
		pass

	@property
	def is_conected(self):
		pass

	def get_device(self):
		pass

	def get_info(self)->DeviceSchema | None:
		pass
