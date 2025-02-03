from yeelight import Bulb, PowerMode
from app.ingternal.device.schemas.config import ChangeField, ConfigSchema
from app.ingternal.device.schemas.device import DeviceSerializeSchema, DeviceInitFieldSchema
from app.ingternal.device.classes.baseDevice import BaseDevice
from app.ingternal.device.classes.baseField import FieldBase
from app.ingternal.device.schemas.enums import TypeDeviceField, DeviceGetData
from app.ingternal.device.interface.field_class import IField
import logging

logger = logging.getLogger(__name__)


def save_new_date(val: IField, status: str):
	if val.get() != status:
		val.set(status)


class YeelightDevice(BaseDevice):
	device_config = ConfigSchema(
		class_img="Yeelight/unnamed.jpg",
		fields_creation=False,
		init_field=True,
		virtual=False,
		token=False,
		type_get_data=False,
		fields_change=ChangeField(
			creation=False,
			deleted=False,
			address=False,
			control=False,
			read_only=False,
			virtual_field=False,
			high=False,
			low=False,
			type=False,
			unit=False,
			name=False,
			enum_values=False,
		),
	)

	def __init__(self, device: DeviceSerializeSchema):
		super().__init__(device)
		self.device = None
		self.cached_values = {}

		if not self.data.address:
			logger.warning("Device address is missing.")
			return
		self.device = Bulb(self.data.address)
		self.data.type_get_data = DeviceGetData.PULL

	async def async_init(self):

		try:
			values = self.device.get_properties()
			self.minmaxValue = self.device.get_model_specs()
			self.cached_values = values
			
			if not values:
				logger.warning("Failed to retrieve device properties.")
				return
			
			if(self.get_field_by_name("night_light") is None and self.minmaxValue["night_light"] != False):
				self._add_field(DeviceInitFieldSchema(name="night_light", read_only=False, high="1", low="0", type=TypeDeviceField.BINARY, icon="", value=values["active_mode"],virtual_field=False))

			field_mappings = {
				"state": ("power", "1", "0", TypeDeviceField.BINARY),
				"bg_power": ("bg_power", "1", "0", TypeDeviceField.BINARY),
				"brightness": ("current_brightness", "100", "0", TypeDeviceField.NUMBER),
				"color": ("hue", "360", "0", TypeDeviceField.NUMBER),
				"bg_color": ("bg_hue", "360", "0", TypeDeviceField.NUMBER),
				"saturation": ("sat", "100", "0", TypeDeviceField.NUMBER),
				"bg_saturation": ("bg_sat", "100", "0", TypeDeviceField.NUMBER),
				"temp": ("ct", str(self.minmaxValue["color_temp"]["max"]), str(self.minmaxValue["color_temp"]["min"]), TypeDeviceField.NUMBER),
				"bg_temp": ("bg_ct", "6500", "1700", TypeDeviceField.NUMBER),
			}
			
			for field, (key, high, low, field_type) in field_mappings.items():
				if self.get_field_by_name(field) is None and key in values and not values[key] is None:
					self._add_field(
						DeviceInitFieldSchema(
							name=field,
							read_only=False,
							high=high,
							low=low,
							type=field_type,
							icon="",
							value=values[key],
							virtual_field=False,
						)
					)
		except Exception as e:
			logger.exception(f"Yeelight initialization error: {e}")
			self.device = None

	@property
	def is_conected(self):
		try:
			return self.device and self.device.get_properties() is not None
		except Exception:
			return False

	def load(self):
		values = self.device.get_properties()
		state = self.get_field_by_name("state")
		if(state and "power" in values):
			val = "0"
			if(values["power"] == "on"):
				val = "1"
			save_new_date(state,val)

		brightness = self.get_field_by_name("brightness")
		if(brightness and "current_brightness" in values):
			save_new_date(brightness,values["current_brightness"])

		bg_brightness = self.get_field_by_name("bg_bright")
		if(bg_brightness and "bg_bright" in values):
			save_new_date(bg_brightness,values["bg_bright"])

		mode = self.get_field_by_name("night_light")
		if(mode and "active_mode" in values):
			save_new_date(mode,values["active_mode"])

		temp = self.get_field_by_name("temp")
		if(temp and "ct" in values):
			save_new_date(temp,values["ct"])
			
		bg_temp = self.get_field_by_name("bg_temp")
		if(bg_temp and "bg_ct" in values):
			save_new_date(bg_temp,values["bg_ct"])

		color = self.get_field_by_name("color")
		if(color and "hue" in values):
			save_new_date(color,values["hue"])
			
		bg_color = self.get_field_by_name("bg_color")
		if(bg_color and "bg_hue" in values):
			save_new_date(bg_color,values["bg_hue"])
			
		bg_power =  self.get_field_by_name("bg_power")
		if(bg_power and "bg_power" in values):
			val = "0"
			if(values["bg_power"] == "on"):
				val = "1"
			save_new_date(bg_power,val)
		saturation = self.get_field_by_name("saturation")
		if(saturation and "sat" in values):
			save_new_date(saturation,values["sat"])
		bg_saturation = self.get_field_by_name("bg_saturation")
		if(bg_saturation and "bg_sat" in values):
			save_new_date(bg_saturation,values["bg_sat"])

	def get_value(self, name):
		self.load()
		return super().get_value(name)

	def get_values(self):
		self.load()
		return super().get_values()

	def set_value(self, id, status):
		new_val = status
		field = self.get_field(id)
		name = field.get_name()
		status = super().set_value(name, status)
		try:
			if name == "state":
				self.device.turn_on() if int(new_val) == 1 else self.device.turn_off()
			elif name == "brightness":
				self.device.set_brightness(int(new_val))
			elif name == "bg_bright":
				self.device.send_command("bg_set_bright", [int(new_val)])
			elif name == "temp":
				self.device.set_power_mode(PowerMode.NORMAL)
				self.device.set_color_temp(int(new_val))
			elif name == "bg_temp":
				self.device.send_command("bg_set_ct_abx", [int(new_val)])
			elif name == "night_light":
				self.device.set_power_mode(PowerMode.MOONLIGHT if int(new_val) == 1 else PowerMode.NORMAL)
			elif name == "color":
				self.device.set_power_mode(PowerMode.HSV)
				self.device.set_hsv(int(new_val), int(self.get_field_by_name("saturation").get()))
			elif name == "bg_color":
				self.device.send_command("bg_set_hsv", [int(new_val), int(self.get_field_by_name("bg_saturation").get())])
			elif name == "saturation":
				self.device.set_power_mode(PowerMode.HSV)
				self.device.set_hsv(int(self.get_field_by_name("color").get()), int(new_val))
			elif name == "bg_saturation":
				self.device.send_command("bg_set_hsv", [int(self.get_field_by_name("bg_color").get()), int(new_val)])
			elif name == "bg_power":
				self.device.send_command("bg_set_power", ["on" if int(new_val) == 1 else "off"])
		except Exception as e:
			logger.exception(f"Error setting Yeelight value ({name}): {e}")
