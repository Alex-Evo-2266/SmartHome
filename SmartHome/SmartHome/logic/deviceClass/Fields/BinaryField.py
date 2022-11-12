

from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from SmartHome.logic.deviceClass.Fields.BaseField import BaseField


class BinaryField(BaseField):
	def __init__(self, *args, **kwargs):
		super(BinaryField, self).__init__(**kwargs, type=TypeField.BINARY)