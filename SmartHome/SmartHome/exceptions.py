
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