

class UserNotFoundException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "user not found"
	
	def __str__(self) -> str:
		if self.message:
			return f"UserNotFoundException, {self.message}"
		else:
			return "UserNotFoundException"

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

class NoDataToConnectException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "no data to connect"
	
	def __str__(self) -> str:
		if self.message:
			return f"NoDataToConnectException, {self.message}"
		else:
			return "NoDataToConnectException"

class InvalidArgumentException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "invalid argument"
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidArgumentException, {self.message}"
		else:
			return "InvalidArgumentException"

class AuthServiceException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "request error"
	
	def __str__(self) -> str:
		if self.message:
			return f"AuthServiceException, {self.message}"
		else:
			return "AuthServiceException"


class TooManyTriesException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "too many tries"
	
	def __str__(self) -> str:
		if self.message:
			return f"TooManyTriesException, {self.message}"
		else:
			return "TooManyTriesException"
		

class UserExistException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "a user with this name already exists."
	
	def __str__(self) -> str:
		if self.message:
			return f"UserExistException, {self.message}"
		else:
			return "UserExistException"
	