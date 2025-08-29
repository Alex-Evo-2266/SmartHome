
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