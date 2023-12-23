class DeviceClassAlreadyBeenRegisteredException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "this class of device has already been registered"
	
	def __str__(self) -> str:
		if self.message:
			return f"DeviceClassAlreadyBeenRegisteredException, {self.message}"
		else:
			return "DeviceClassAlreadyBeenRegisteredException"