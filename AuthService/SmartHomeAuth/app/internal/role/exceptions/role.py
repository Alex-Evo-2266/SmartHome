class RoleAlreadyExistsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "role already exists"
	
	def __str__(self) -> str:
		if self.message:
			return f"RoleAlreadyExistsException, {self.message}"
		else:
			return "RoleAlreadyExistsException"
		
class RoleNotFoundException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "role not found"
	
	def __str__(self) -> str:
		if self.message:
			return f"RoleNotFoundException, {self.message}"
		else:
			return "RoleNotFoundException"
		
class PrivilegeNotFoundException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "privilege not found"
	
	def __str__(self) -> str:
		if self.message:
			return f"PrivilegeNotFoundException, {self.message}"
		else:
			return "PrivilegeNotFoundException"