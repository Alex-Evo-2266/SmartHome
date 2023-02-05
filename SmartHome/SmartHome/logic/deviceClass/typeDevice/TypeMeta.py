

from SmartHome.logic.deviceClass.typeDevice.Types import DeviceTypeClasses
from SmartHome.logic.deviceClass.schema import FieldTypeDevice, TypeDevice
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField

def filter_parametr(dct):
	new_dict = dict()
	for key in dct:
		if len(key) < 3 or (len(key) > 3 and key[0] != "_" and key[1] != "_"):
			new_dict[key] = dct[key]
	return new_dict

class DeviceTypeMeta(type):
	def __new__(cls, clsname, bases, dct, use=True, page=None):
		new_class = super(DeviceTypeMeta, cls).__new__(cls, clsname, bases, dct)
		if use:
			fields = []
			sort_field = filter_parametr(dct)
			print("types",sort_field)
			for key in sort_field:
				if type(sort_field[key]) == TypeField:
					fields.append(FieldTypeDevice(name=key, type=sort_field[key]))
			DeviceTypeClasses.add(clsname, TypeDevice(name=clsname, fields=fields))
		return new_class