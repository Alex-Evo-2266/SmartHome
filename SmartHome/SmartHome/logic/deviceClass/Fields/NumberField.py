
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from SmartHome.logic.deviceClass.Fields.BaseField import BaseField


class NumberField(BaseField):
	def __init__(self, *args, **kwargs):
		super(NumberField, self).__init__(**kwargs, type=TypeField.NUMDER)