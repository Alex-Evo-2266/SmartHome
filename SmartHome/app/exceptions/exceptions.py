

class NoConfigurationDataException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "no data"
	
	def __str__(self) -> str:
		if self.message:
			return f"NoConfigurationDataException, {self.message}"
		else:
			return "NoConfigurationDataException"

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

class InvalidAttributeException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "invalid attribute"
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidAttributeException, {self.message}"
		else:
			return "InvalidAttributeException"

class InvalidInputException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "invalid input data"
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidInputException, {self.message}"
		else:
			return "InvalidInputException"

class OutdatedJwtException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "outdated jwt"
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidInputException, {self.message}"
		else:
			return "InvalidInputException"

class UserAlreadyExistsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "user already exists"
	
	def __str__(self) -> str:
		if self.message:
			return f"UserAlreadyExistsException, {self.message}"
		else:
			return "UserAlreadyExistsException"

class InvalidFileStructure(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "invalid file structure."
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidFileStructure, {self.message}"
		else:
			return "InvalidFileStructure"

class ModelElementNotFound(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "model element not found."
	
	def __str__(self) -> str:
		if self.message:
			return f"ModelElementNotFound, {self.message}"
		else:
			return "ModelElementNotFound"

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