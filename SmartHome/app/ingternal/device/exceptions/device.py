class DeviceNotFound(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "device not found."
	
	def __str__(self) -> str:
		if self.message:
			return f"DeviceNotFound, {self.message}"
		else:
			return "DeviceNotFound"
		
class DevicesStructureNotFound(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "Device structure not found."
	
	def __str__(self) -> str:
		if self.message:
			return f"DevicesStructureNotFound, {self.message}"
		else:
			return "DevicesStructureNotFound"
		

class ClassAlreadyExistsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "the class already exists"
	
	def __str__(self) -> str:
		if self.message:
			return f"ClassAlreadyExistsException, {self.message}"
		else:
			return "ClassAlreadyExistsException"
		
class DuplicateFieldsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "duplicate fields"
	
	def __str__(self) -> str:
		if self.message:
			return f"DuplicateFieldsException, {self.message}"
		else:
			return "DuplicateFieldsException"