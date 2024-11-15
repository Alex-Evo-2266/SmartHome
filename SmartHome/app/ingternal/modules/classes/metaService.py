import logging
from ..utils.get_device_classes import init_device_calsses
from ..utils.get_services import get_services
from app.ingternal.modules.arrays.serviceArray import ServiceArray

logger = logging.getLogger(__name__)

class ServiceMeta(type):
	def __new__(cls, clsname, bases, dct, use=True):

		new_class = super(ServiceMeta, cls).__new__(cls, clsname, bases, dct)
		if use:
			ServiceArray.register(clsname, new_class)
		return new_class
