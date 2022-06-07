from moduls_src.models_schema import AddDevice, EditDevice, EditField, TypeAddDevice
from yeelight import Bulb,PowerMode
from SmartHome.logic.device.BaseDeviceClass import BaseDevice
from SmartHome.logic.device.DeviceElement import DeviceElement
from castom_moduls.Yeelight.settings import DEVICE_NAME
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

class Device(BaseDevice):

    typesDevice = ["light"]
    name = DEVICE_NAME
    addConfig=AddDevice(fields=False, description="1. Through the original application, you must enable device management over the local network.\n2. Enter the ip-address of the device (it can be viewed in the same application).")
    editConfig=EditDevice(address=True, fields=EditField(icon=True))

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)
        self.device = Bulb(self.coreAddress)
        try:
            values = self.device.get_properties()
            self.minmaxValue = self.device.get_model_specs()
            if(not look_for_param(self.values, "state") and "power" in values):
                val = "0"
                if(values["power"] == "on"):
                    val = "1"
                self.values.append(DeviceElement(name="state", systemName=self.systemName, control=True, high=1, low=0, type="binary", icon="fas fa-power-off", value=val))
            if(not look_for_param(self.values, "brightness") and "current_brightness" in values):
                self.values.append(DeviceElement(name="brightness", systemName=self.systemName, control=True, high=100, low=0, type="number", icon="far fa-sun", value=values["current_brightness"]))
            if(not look_for_param(self.values, "night_light") and self.minmaxValue["night_light"] != False):
                self.values.append(DeviceElement(name="night_light", systemName=self.systemName, control=True, high="1", low=0, type="binary", icon="fab fa-moon", value=values["active_mode"]))
            if(not look_for_param(self.values, "color") and values["hue"] != None):
                self.values.append(DeviceElement(name="color", systemName=self.systemName, control=True, high=360, low=0, type="number", icon="fab fa-medium-m", value=values["hue"]))
            if(not look_for_param(self.values, "saturation") and values["sat"] != None):
                self.values.append(DeviceElement(name="saturation", systemName=self.systemName, control=True, high=100, low=0, type="number", icon="fab fa-medium-m", value=values["sat"]))
            if(not look_for_param(self.values, "temp") and "ct" in values):
                self.values.append(DeviceElement(name="temp", systemName=self.systemName, control=True, high=self.minmaxValue["color_temp"]["max"], low=self.minmaxValue["color_temp"]["min"], type="number", icon="fas fa-adjust", value=values["ct"]))
            super().save()
        except Exception as e:
            logger.warning(f"yeelight initialize error. {e}")
            self.device = None

    def update_value(self, *args, **kwargs):
        values = self.device.get_properties()
        state = look_for_param(self.values, "state")
        if(state and "power" in values):
            val = "0"
            if(values["power"] == "on"):
                val = "1"
            saveNewDate(state,val)
        brightness = look_for_param(self.values, "brightness")
        if(brightness and "current_brightness" in values):
            saveNewDate(brightness,values["current_brightness"])
        mode = look_for_param(self.values, "night_light")
        if(mode and "active_mode" in values):
            saveNewDate(mode,values["active_mode"])
        temp = look_for_param(self.values, "temp")
        if(temp and "ct" in values):
            saveNewDate(temp,values["ct"])
        color = look_for_param(self.values, "color")
        if(color and "hue" in values):
            saveNewDate(color,values["hue"])
        saturation = look_for_param(self.values, "saturation")
        if(saturation and "sat" in values):
            saveNewDate(saturation,values["sat"])


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
        if(name == "temp"):
            self.device.set_power_mode(PowerMode.NORMAL)
            self.device.set_color_temp(int(status))
        if(name == "night_light"):
            if(int(status)==1):
                self.device.set_power_mode(PowerMode.MOONLIGHT)
            if(int(status)==0):
                self.device.set_power_mode(PowerMode.NORMAL)
        if(name == "color"):
            self.device.set_power_mode(PowerMode.HSV)
            saturation = look_for_param(self.values, "saturation")
            self.device.set_hsv(int(status), int(saturation.get()))
        if(name == "saturation"):
            self.device.set_power_mode(PowerMode.HSV)
            color = look_for_param(self.values, "color")
            self.device.set_hsv(int(color.get()), int(status))

    def get_All_Info(self):
        self.update_value()
        return super().get_All_Info()
