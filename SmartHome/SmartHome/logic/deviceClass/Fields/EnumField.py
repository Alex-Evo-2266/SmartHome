
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from SmartHome.logic.deviceClass.Fields.BaseField import BaseField


class EnumField(BaseField):
	def __init__(self, *args, **kwargs):
		super(EnumField, self).__init__(**kwargs, type=TypeField.ENUM)