from typing import List, Dict, Any
from app.device.schemas import DeviceSchema
import logging

logger = logging.getLogger(__name__)

class IGetDeviceData():
	"""interface for receiving device data."""

	def get_value(self, name:str)->Dict[str, str] | None:
		pass

	def get_values(self)->List[Dict[str, str]]:
		pass

	@property
	def is_conected(self)->bool:
		pass

	def get_device(self)->Any | None:
		pass

	def dict(self)->Dict[str, str]:
		pass

	def get_data(self)->DeviceSchema:
		pass