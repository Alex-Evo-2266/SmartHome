import logging, importlib, subprocess

from typing import Optional

from .utils.get_device_classes import init_device_classes
from .utils.get_services import get_services
from .utils.move_images import init_images

logger = logging.getLogger(__name__)

class ModulesMeta(type):

	
	def __new__(cls, clsname, bases, dct, scan_module=True):

		if scan_module:
			init_images(dct.get('__module__'))
			init_device_classes(dct.get('__module__'))

			get_services(dct.get('__module__'))

		new_class = super(ModulesMeta, cls).__new__(cls, clsname, bases, dct)
		return new_class
