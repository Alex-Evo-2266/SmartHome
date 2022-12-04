

from typing import Dict


class Modules():
	services = {}

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
		Modules.add(clsname, new_class)
		return new_class

class BaseModule(metaclass=ModuleMeta):
	@staticmethod
	def start():
		pass
		
	@staticmethod
	def end(self):
		pass

	dependencies=[]