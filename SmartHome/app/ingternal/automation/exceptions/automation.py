class AutomationNotFound(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "automation not found."
	
	def __str__(self) -> str:
		if self.message:
			return f"AutomationNotFound, {self.message}"
		else:
			return "AutomationNotFound"