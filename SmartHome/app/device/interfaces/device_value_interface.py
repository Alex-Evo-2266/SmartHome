from typing import List, Any, Dict
import logging
from app.device.interfaces.field_interface import IField

logger = logging.getLogger(__name__)

class IValueDevice():
	"""interface for receiving device data."""

	def get_values(self)->List[Dict[str, str]]:
		pass

	def set_value(self, name:str, status:Any):
		pass

	def get_field(self, name:str)->IField | None:
		pass

	def get_value(self, name:str)->Dict[str, str] | None:
		pass