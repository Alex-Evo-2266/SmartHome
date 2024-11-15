import logging
from ..utils.get_device_classes import init_device_calsses
from ..utils.get_services import get_services

logger = logging.getLogger(__name__)

class ModulesMeta(type):
	def __new__(cls, clsname, bases, dct, scan_module=True):
		if scan_module:
			init_device_calsses(dct.get('__module__'))

			get_services(dct.get('__module__'))

		new_class = super(ModulesMeta, cls).__new__(cls, clsname, bases, dct)
		return new_class
