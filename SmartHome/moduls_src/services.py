class Services():
	services = {}

	@staticmethod
	def add(name, data):
		print(Services.services)
		if name in Services.services:
			return
			# raise Exception("an element with the same name already exists")
		Services.services[name] = data
		print(Services.services)

	@staticmethod
	def get(name):
		if not name in Services.services:
			return None
		return Services.services[name]
	
	@staticmethod
	def all()->dict:
		return Services.services

class ServiceMeta(type):
	def __new__(cls, clsname, bases, dct):
		new_class = super(ServiceMeta, cls).__new__(cls, clsname, bases, dct)
		Services.add(clsname, new_class)
		return new_class

class BaseService(metaclass=ServiceMeta):
	pass