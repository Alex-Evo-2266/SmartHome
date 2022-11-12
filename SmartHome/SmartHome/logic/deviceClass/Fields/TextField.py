

from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from SmartHome.logic.deviceClass.Fields.BaseField import BaseField


class TextField(BaseField):
	def __init__(self, *args, **kwargs):
		super(TextField, self).__init__(**kwargs, type=TypeField.TEXT)