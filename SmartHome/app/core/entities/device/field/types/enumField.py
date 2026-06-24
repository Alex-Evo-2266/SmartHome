
from app.core.entities.device.baseField import FieldBase
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

class EnumField (FieldBase):

	def set(self, value: str, script: bool = True):
		enums = self.get_enum()
		if enums is None:
			logger.warning(f"Enum field '{self.get_name()}' has no enum values defined")
			return
		if value in enums:
			self.data.value = value
		else:
			logger.warning(f"Invalid enum value '{value}' for field '{self.get_name()}'")


	def get_actions(self) -> list[str]:
		return [
			"set"
		]

	def execute_action(
		self,
		action: str,
		value: str | None = None
	):
		if value is None:
			raise ValueError("value required")
			
		match action:
			case "set":
				self.set(value)

			case _:
				raise ValueError(action)

