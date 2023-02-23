from typing import List, Any
from SmartHome.logic.deviceFile.schema import DeviceFieldSchema, DeviceSchema
from SmartHome.logic.deviceClass.Fields.FieldInterface import IField
import logging

logger = logging.getLogger(__name__)

class IValueDevice():
	"""interface for receiving device data."""

	def get_values(self)->List[DeviceFieldSchema] | None:
		pass

	def set_value(self, name:str, status:Any):
		pass

	def get_field(self, name:str)->IField | None:
		pass