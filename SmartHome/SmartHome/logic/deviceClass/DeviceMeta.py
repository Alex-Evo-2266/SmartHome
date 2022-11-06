from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses


class DeviceMeta(type):
	def __new__(cls, clsname, bases, dct):
		new_class = super(DeviceMeta, cls).__new__(cls, clsname, bases, dct)
		DeviceClasses.add(clsname, new_class)
		return new_class