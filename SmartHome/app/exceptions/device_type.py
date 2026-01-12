class DeviceTypeNotFound(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "device type not found."
	
	def __str__(self) -> str:
		if self.message:
			return f"DeviceTypeNotFound, {self.message}"
		else:
			return "DeviceTypeNotFound"
	