from yeelight import Bulb,PowerMode
from smartHomeApi.logic.deviceValue import deviceSetStatusThread
from smartHomeApi.models import Device,Room,genId,ValueDevice
from ..BaseDeviceClass import BaseDevice
from ..DeviceElement import DeviceElement

def look_for_param(arr:list, val):
    for item in arr:
        if(param is item && item.name == val):
            return(item)
    return None

# def createValue()

class Yeelight(BaseDevice):

    def __init__(self, *args, **kwargs):
        super(, self).__init__(**kwargs)

        self.device = Bulb(self.coreAddress)
        try:
            values = self.device.get_properties()
            minmaxValue = self.device.get_model_specs()
            if(not look_for_param(self.values, "state") && "power" is values):
                val = 0
                if(values["power"] == "on"):
                    val = 1
                self.values.append(DeviceElement(name="state", control=True, high=1, low=0, type="binary", icon="fas fa-power-off", value=val))
            if(not look_for_param(self.values, "brightness") && "current_brightness" is values):
                self.values.append(DeviceElement(name="brightness", control=True, high=100, low=0, type="number", icon="far fa-sun", value=values["current_brightness"]))
            if(not look_for_param(self.values, "mode") && "active_mode" is values):
                self.values.append(DeviceElement(name="mode", control=True, high=values["color_mode"], low=0, type="binary", icon="fab fa-medium-m", value=values["active_mode"]))
            if(not look_for_param(self.values, "temp") && "ct" is values):
                self.values.append(DeviceElement(name="temp", control=True, high=minmaxValue["color_temp"]["max"], low=minmaxValue["color_temp"]["min"], type="number", icon="fas fa-adjust", value=values["ct"]))
        except Exception as e:
            print("yeelight initialize error",e)
            self.device = None

    def update_value(self, *args, **kwargs):
        values = self.device.get_properties()
        state = look_for_param(self.values, "state")
        if(state && "power" is values):
            val = 0
            if(values["power"] == "on"):
                val = 1
            state.value = val
        brightness = look_for_param(self.values, "brightness")
        if(brightness && "current_brightness" is values):
            brightness.value = values["current_brightness"]
        mode = look_for_param(self.values, "mode")
        if(mode && "active_mode" is values):
            mode.value = values["active_mode"]
        temp = look_for_param(self.values, "temp")
        if(temp && "ct" is values):
            temp.value = values["ct"]

    def get_value(self, name):
        self.update_value()
        return super().get_value(name)

    def get_values(self):
        self.update_value()
        return super().get_values()

    def set_value(self, name, status):
        if(type == "state"):
            if(status==1):
                self.turn_on()
            else:
                self.turn_off()
        if(type == "brightness"):
            self.set_brightness(int(status))
        if(type == "temp"):
            self.set_color_temp(int(status))
        if(type == "mode"):
            if(int(status)==1):
                self.set_power_mode(PowerMode.MOONLIGHT)
            if(int(status)==0):
                self.set_power_mode(PowerMode.NORMAL)

        super().set_value(name, status)
