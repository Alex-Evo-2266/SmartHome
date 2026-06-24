

from app.core.entities.device.baseField import FieldBase
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

class  NumberField(FieldBase):

	def set(self, status: str, script: bool = True):
		high = self.getInt(self.data.high)
		low = self.getInt(self.data.low)
		status_float = self.getFloat(status)

		if status_float is None:
			logger.warning(f"Invalid number value '{status}' for field '{self.get_name()}'")
			return

		if high is not None and status_float > high:
			self.data.value = str(high)
		elif low is not None and status_float < low:
			self.data.value = str(low)
		else:
			self.data.value = str(status_float)


	def get_actions(self) -> list[str]:
		return [
			"set",
			"increase",
			"decrease"
		]

	def increase(self, value: float):
		current = float(self.get() or 0)
		self.set(str(current + value))

	def decrease(self, value: float):
		current = float(self.get() or 0)
		self.set(str(current - value))

	def execute_action(
		self,
		action: str,
		value: str | None = None
	):
		if value is None:
			raise ValueError("value required")
		status_float = self.getFloat(value)
		if status_float is None:
			logger.warning(f"Invalid number value '{value}' for field '{self.get_name()}'")
			return
			
		match action:
			case "increase":
				self.increase(status_float)

			case "decrease":
				self.decrease(status_float)

			case "set":
				self.set(value)

			case _:
				raise ValueError(action)
				