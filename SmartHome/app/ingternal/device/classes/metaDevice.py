from typing import List
from app.ingternal.exceptions.base import InvalidAttributeException
from app.ingternal.device.arrays.DeviceClasses import DeviceClasses

class DeviceMeta(type):
	def __new__(cls, clsname, bases, dct, config = None, use=True, castom_name=None):

		if castom_name:
			clsname = castom_name
		new_class = super(DeviceMeta, cls).__new__(cls, clsname, bases, dct)
		if use:
			DeviceClasses.add(clsname, new_class)
		return new_class
	
