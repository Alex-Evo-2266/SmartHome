from yeelight import Bulb, PowerMode
from app.ingternal.device.schemas.device_class import ChangeField, ConfigSchema
from app.ingternal.device.type_class.LightType import Light
from app.ingternal.device.device_class.BaseDeviceClass import BaseDevice
from app.ingternal.device.device_class.BaseField import BaseField
from app.ingternal.device.enums import TypeDeviceField
import logging

logger = logging.getLogger(__name__)

def look_for_param(arr:list, val):
	for item in arr:
		if(item.name == val):
			return(item)
	return None

def saveNewDate(val, status):
	if(val.get() != status):
		val.set(status)

# def createValue()

class YeelightDevice(BaseDevice):

	types = [Light]

	class Config(ConfigSchema):
		class_img = "Yeelight/unnamed.jpg"
		fields_addition: bool = False
		init_field = True
		change_polling = False
		fields_change: ChangeField = ChangeField(
			added=False,
			deleted=False,
			address=False,
			control=False,
			high=False,
			low=False,
			type=False,
			unit=False,
			name=False,
			enum_values=False
		)

	def __init__(self, *args, **kwargs):
		kwargs["device_cyclic_polling"] = True
		super().__init__(**kwargs)
		if not self.address:
			return
		self.device = Bulb(self.address)
		try:
			values = self.device.get_properties()
			self.minmaxValue = self.device.get_model_specs()
			print("p9", values, self.minmaxValue)
			if(not look_for_param(self.values, "state") and "power" in values):
				val = "0"
				if(values["power"] == "on"):
					val = "1"
				self.values.append(BaseField(name="state", device_system_name=self.system_name, read_only=False, high="1", low="0", type=TypeDeviceField.BINARY, icon="", value=val))
			if(not look_for_param(self.values, "bg_power") and values["bg_power"] != None):
				val = "0"
				if(values["bg_power"] == "on"):
					val = "1"
				self.values.append(BaseField(name="bg_power", device_system_name=self.system_name, read_only=False, high="1", low="0", type=TypeDeviceField.BINARY, icon="", value=val))
			if(not look_for_param(self.values, "brightness") and "current_brightness" in values):
				self.values.append(BaseField(name="brightness", device_system_name=self.system_name, read_only=False, high="100", low="0", type=TypeDeviceField.NUMBER, icon="", value=values["current_brightness"]))
			if(not look_for_param(self.values, "night_light") and self.minmaxValue["night_light"] != False):
				self.values.append(BaseField(name="night_light", device_system_name=self.system_name, read_only=False, high="1", low="0", type=TypeDeviceField.BINARY, icon="", value=values["active_mode"]))
			if(not look_for_param(self.values, "color") and values["hue"] != None):
				self.values.append(BaseField(name="color", device_system_name=self.system_name, read_only=False, high="360", low="0", type=TypeDeviceField.NUMBER, icon="", value=values["hue"]))
			if(not look_for_param(self.values, "bg_color") and values["bg_hue"] != None):
				self.values.append(BaseField(name="bg_color", device_system_name=self.system_name, read_only=False, high="360", low="0", type=TypeDeviceField.NUMBER, icon="", value=values["bg_hue"]))
			if(not look_for_param(self.values, "bg_bright") and values["bg_bright"] != None):
				self.values.append(BaseField(name="bg_bright", device_system_name=self.system_name, read_only=False, high="100", low="0", type=TypeDeviceField.NUMBER, icon="", value=values["bg_bright"]))
			if(not look_for_param(self.values, "saturation") and values["sat"] != None):
				self.values.append(BaseField(name="saturation", device_system_name=self.system_name, read_only=False, high="100", low="0", type=TypeDeviceField.NUMBER, icon="", value=values["sat"]))
			if(not look_for_param(self.values, "bg_saturation") and values["bg_sat"] != None):
				self.values.append(BaseField(name="bg_saturation", device_system_name=self.system_name, read_only=False, high="100", low="0", type=TypeDeviceField.NUMBER, icon="", value=values["bg_sat"]))
			if(not look_for_param(self.values, "temp") and "ct" in values):
				self.values.append(BaseField(name="temp", device_system_name=self.system_name, read_only=False, high=self.minmaxValue["color_temp"]["max"], low=self.minmaxValue["color_temp"]["min"], type=TypeDeviceField.NUMBER, icon="", value=values["ct"]))
			if(not look_for_param(self.values, "bg_temp") and values["bg_ct"] != None):
				self.values.append(BaseField(name="bg_temp", device_system_name=self.system_name, read_only=False, high="6500", low="1700", type=TypeDeviceField.NUMBER, icon="", value=values["bg_ct"]))
		except Exception as e:
			logger.warning(f"yeelight initialize error. {e}")
			self.device = None

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return self.device

	def update_value(self, *args, **kwargs):
		values = self.device.get_properties()
		print(values)
		state = look_for_param(self.values, "state")
		if(state and "power" in values):
			val = "0"
			if(values["power"] == "on"):
				val = "1"
			saveNewDate(state,val)
		brightness = look_for_param(self.values, "brightness")
		if(brightness and "current_brightness" in values):
			saveNewDate(brightness,values["current_brightness"])
		bg_brightness = look_for_param(self.values, "bg_bright")
		if(bg_brightness and "bg_bright" in values):
			saveNewDate(bg_brightness,values["bg_bright"])
		mode = look_for_param(self.values, "night_light")
		if(mode and "active_mode" in values):
			saveNewDate(mode,values["active_mode"])
		temp = look_for_param(self.values, "temp")
		if(temp and "ct" in values):
			saveNewDate(temp,values["ct"])
		bg_temp = look_for_param(self.values, "bg_temp")
		if(bg_temp and "bg_ct" in values):
			saveNewDate(bg_temp,values["bg_ct"])
		color = look_for_param(self.values, "color")
		if(color and "hue" in values):
			saveNewDate(color,values["hue"])
		bg_color = look_for_param(self.values, "bg_color")
		if(bg_color and "bg_hue" in values):
			saveNewDate(bg_color,values["bg_hue"])
		bg_power = look_for_param(self.values, "bg_power")
		if(bg_power and "bg_power" in values):
			val = "0"
			if(values["bg_power"] == "on"):
				val = "1"
			saveNewDate(bg_power,val)
		saturation = look_for_param(self.values, "saturation")
		if(saturation and "sat" in values):
			saveNewDate(saturation,values["sat"])
		bg_saturation = look_for_param(self.values, "bg_saturation")
		if(bg_saturation and "bg_sat" in values):
			saveNewDate(bg_saturation,values["bg_sat"])

	def updata(self):
		return self.update_value()

	def get_value(self, name):
		self.update_value()
		return super().get_value(name)

	def get_values(self):
		self.update_value()
		return super().get_values()

	def set_value(self, name, status):
		status = super().set_value(name, status)
		if(name == "state"):
			if(int(status)==1):
				self.device.turn_on()
			else:
				self.device.turn_off()
		if(name == "brightness"):
			self.device.set_brightness(int(status))
		if(name == "bg_bright"):
			self.device.send_command("bg_set_bright", [int(status)])
		if(name == "temp"):
			self.device.set_power_mode(PowerMode.NORMAL)
			self.device.set_color_temp(int(status))
		if(name == "bg_temp"):
			self.device.send_command("bg_set_ct_abx", [int(status)])
		if(name == "night_light"):
			if(int(status)==1):
				self.device.set_power_mode(PowerMode.MOONLIGHT)
			if(int(status)==0):
				self.device.set_power_mode(PowerMode.NORMAL)
		if(name == "color"):
			self.device.set_power_mode(PowerMode.HSV)
			saturation = look_for_param(self.values, "saturation")
			self.device.set_hsv(int(status), int(saturation.get()))
		if(name == "bg_color"):
			saturation = look_for_param(self.values, "bg_saturation")
			self.device.send_command("bg_set_hsv", [int(status), int(saturation.get())])
		if(name == "saturation"):
			self.device.set_power_mode(PowerMode.HSV)
			color = look_for_param(self.values, "color")
			self.device.set_hsv(int(color.get()), int(status))
		if(name == "bg_saturation"):
			color = look_for_param(self.values, "bg_color")
			self.device.send_command("bg_set_hsv", [int(color.get()), int(status)])
		if(name == "bg_power"):
			if(int(status)==1):
				self.device.send_command("bg_set_power", ["on"])
			else:
				self.device.send_command("bg_set_power", ["off"])
		# if(name == "bg_power"):
		# 	self.device.set_power_mode(PowerMode.HSV)
		# 	color = look_for_param(self.values, "color")
		# 	self.device.set_hsv(int(color.get()), int(status))

	# def get_All_Info(self):
	# 	self.update_value()
	# 	return super().get_All_Info()
