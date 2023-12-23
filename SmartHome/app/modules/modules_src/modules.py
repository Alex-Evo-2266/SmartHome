

from typing import Dict, Any
from app.modules.modules_src.routers import Routers


class Modules():
	services:Dict[str, Any] = {}
	routers = []

	@staticmethod
	def add(name, data):
		if name in Modules.services:
			return
			# raise Exception("an element with the same name already exists")
		Modules.services[name] = data

	@staticmethod
	def get(name):
		if not name in Modules.services:
			return None
		return Modules.services[name]

	@staticmethod
	def all()->dict:
		return Modules.services

class ModuleMeta(type):
	def __new__(cls, clsname, bases, dct):
		new_class = super(ModuleMeta, cls).__new__(cls, clsname, bases, dct)
		if clsname != "BaseModule":
			Modules.add(clsname, new_class)
		if "routers" in dct:
			routers = dct["routers"]
			Routers.add(clsname, routers)
		
		return new_class

class BaseModule(metaclass=ModuleMeta):

	@staticmethod
	def start():
		pass
		
	@staticmethod
	def end(self):
		pass

	dependencies=[]
	routers = []
