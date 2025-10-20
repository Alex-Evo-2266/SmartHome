
class RoomAlreadyExistsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "the room already exists"
	
	def __str__(self) -> str:
		if self.message:
			return f"RoomAlreadyExistsException, {self.message}"
		else:
			return "RoomAlreadyExistsException"
		


class RoomNotFoundException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "the room not found"
	
	def __str__(self) -> str:
		if self.message:
			return f"RoomNotFoundException, {self.message}"
		else:
			return "RoomNotFoundException"