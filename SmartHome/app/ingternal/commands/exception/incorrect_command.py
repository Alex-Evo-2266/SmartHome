class IncorrectCommand(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "incorrect command."
	
	def __str__(self) -> str:
		if self.message:
			return f"IncorrectCommand, {self.message}"
		else:
			return "IncorrectCommand"