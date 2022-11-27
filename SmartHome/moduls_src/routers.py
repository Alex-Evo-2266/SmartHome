class Routers():
	services = {}

	@staticmethod
	def add(name, data):
		Routers.services[name] = data

	@staticmethod
	def get(name):
		if not name in Routers.services:
			return None
		return Routers.services[name]