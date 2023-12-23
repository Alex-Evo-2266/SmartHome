class Routers():
	services = {}

	@classmethod
	def add(cls, name, data):
		cls.services[name] = data

	@classmethod
	def get(cls, name):
		if not name in cls.services:
			return None
		return cls.services[name]