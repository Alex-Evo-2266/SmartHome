
class InvalidInputException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "invalid data"
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidInputException, {self.message}"
		else:
			return "InvalidInputException"