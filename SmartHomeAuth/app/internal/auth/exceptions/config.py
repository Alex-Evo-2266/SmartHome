		
class InvalidConfigException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "invalid service config"
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidConfigException, {self.message}"
		else:
			return "InvalidConfigException"
				
class ConfigNotFoundException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "config not found"
	
	def __str__(self) -> str:
		if self.message:
			return f"ConfigNotFoundException, {self.message}"
		else:
			return "ConfigNotFoundException"