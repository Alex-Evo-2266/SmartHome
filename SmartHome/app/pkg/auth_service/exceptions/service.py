
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


