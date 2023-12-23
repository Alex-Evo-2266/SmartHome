class Services():
	services = {}

	@classmethod
	def add(cls, name: str, data):
		if name in cls.services:
			return
			# raise Exception("an element with the same name already exists")
		cls.services[name] = data

	@classmethod
	def get(cls, name: str):
		if not name in cls.services:
			return None
		return cls.services[name]
	
	@classmethod
	def all(cls)->dict:
		return cls.services

class ServiceMeta(type):
	def __new__(cls, clsname, bases, dct):
		new_class = super(ServiceMeta, cls).__new__(cls, clsname, bases, dct)
		if clsname != "BaseService":
			Services.add(clsname, new_class)
		return new_class

class BaseService(metaclass=ServiceMeta):
	pass