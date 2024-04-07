
class ScriptAlreadyExists(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "the script already exists."
	
	def __str__(self) -> str:
		if self.message:
			return f"ScriptAlreadyExists, {self.message}"
		else:
			return "ScriptAlreadyExists"