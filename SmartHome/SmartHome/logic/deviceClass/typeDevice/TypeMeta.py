

from SmartHome.logic.deviceClass.typeDevice.Types import DeviceTypeClasses
from SmartHome.logic.deviceClass.schema import FieldTypeDevice, TypeDevice

def filter_parametr(dct):
	new_dict = dict()
	for key in dct:
		if key[0] != "_" and key[1] != "_":
			new_dict[key] = dct[key]
	return new_dict

class DeviceTypeMeta(type):
	def __new__(cls, clsname, bases, dct, use=True):
		new_class = super(DeviceTypeMeta, cls).__new__(cls, clsname, bases, dct)
		print("types",dct)
		if use:
			fields = []
			sort_field = filter_parametr(dct)
			for key in sort_field:
				fields.append(FieldTypeDevice(name=key, type=sort_field[key]))
			DeviceTypeClasses.add(clsname, TypeDevice(name=clsname, fields=fields))
		return new_class