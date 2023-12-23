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