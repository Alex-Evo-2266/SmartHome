class ScriptsNotFound(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "scripts not found."
	
	def __str__(self) -> str:
		if self.message:
			return f"ScriptsNotFound, {self.message}"
		else:
			return "ScriptsNotFound"