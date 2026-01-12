from typing import List
from app.exceptions.base import InvalidAttributeException
from app.core.state.get_store import get_container

class DeviceMeta(type):
	def __new__(cls, clsname, bases, dct, config = None, use=True, castom_name=None):

		if castom_name:
			clsname = castom_name
		new_class = super(DeviceMeta, cls).__new__(cls, clsname, bases, dct)
		if use:
			get_container().class_store.add(clsname, new_class)
		return new_class
	
