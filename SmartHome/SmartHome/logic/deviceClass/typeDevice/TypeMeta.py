

from SmartHome.logic.deviceClass.typeDevice.Types import DeviceTypeClasses


class DeviceTypeMeta(type):
	def __new__(cls, clsname, bases, dct, use=True):
		new_class = super(DeviceTypeMeta, cls).__new__(cls, clsname, bases, dct)
		print(dct)
		if use:
			DeviceTypeClasses.add(clsname, new_class)
		return new_class