
from app.core.entities.device.baseField import FieldBase
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

class BinaryField(FieldBase):

	def set(self, status: str, script: bool = True):
		if self.data.high is not None and str(self.data.high) == status:
			self.data.value = '1'
		elif self.data.low is not None and str(self.data.low) == status:
			self.data.value = '0'
		elif self.data.high is None and self.data.low is None:
			if status in ('1', '0'):
				self.data.value = status
		else:
			logger.warning(f"Invalid binary value '{status}' for field '{self.get_name()}'")

	def get_actions(self) -> list[str]:
		return [
			"on",
			"off",
			"toggle",
			"set"
		]

	def on(self):
		self.set("1")

	def off(self):
		self.set("0")

	def toggle(self):
		self.set("0" if self.get() == "1" else "1")

	def execute_action(
		self,
		action: str,
		value: str | None = None
	):
		match action:
			case "on":
				self.on()

			case "off":
				self.off()

			case "toggle":
				self.toggle()

			case "set":
				if value is None:
					raise ValueError("value required")
				self.set(value)

			case _:
				raise ValueError(action)