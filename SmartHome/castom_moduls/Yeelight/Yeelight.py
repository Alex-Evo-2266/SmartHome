from yeelight import Bulb,PowerMode
from smartHomeApi.models import Device,Room,genId,ValueDevice
from smartHomeApi.logic.deviceControl.BaseDeviceClass import BaseDevice
from smartHomeApi.logic.deviceControl.DeviceElement import DeviceElement

def look_for_param(arr:list, val):
    for item in arr:
        if(item.name == val):
            return(item)
    return None

# def createValue()

class Yeelight(BaseDevice):

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
                self.values.append(DeviceElement(name="state", control=True, high=1, low=0, type="binary", icon="fas fa-power-off", value=val))
            if(not look_for_param(self.values, "brightness") and "current_brightness" in values):
                self.values.append(DeviceElement(name="brightness", control=True, high=100, low=0, type="number", icon="far fa-sun", value=values["current_brightness"]))
            if(not look_for_param(self.values, "night_light") and self.minmaxValue["night_light"] != False):
                self.values.append(DeviceElement(name="night_light", control=True, high="1", low=0, type="binary", icon="fab fa-moon", value=values["active_mode"]))
            if(not look_for_param(self.values, "color") and values["hue"] != None):
                self.values.append(DeviceElement(name="color", control=True, high=360, low=0, type="number", icon="fab fa-medium-m", value=values["hue"]))
            if(not look_for_param(self.values, "saturation") and values["sat"] != None):
                self.values.append(DeviceElement(name="saturation", control=True, high=100, low=0, type="number", icon="fab fa-medium-m", value=values["sat"]))
            if(not look_for_param(self.values, "temp") and "ct" in values):
                self.values.append(DeviceElement(name="temp", control=True, high=self.minmaxValue["color_temp"]["max"], low=self.minmaxValue["color_temp"]["min"], type="number", icon="fas fa-adjust", value=values["ct"]))
            super().save()
        except Exception as e:
            print("yeelight initialize error",e)
            self.device = None

    def update_value(self, *args, **kwargs):
        values = self.device.get_properties()
        state = look_for_param(self.values, "state")
        if(state and "power" in values):
            val = "0"
            if(values["power"] == "on"):
                val = "1"
            state.value = val
        brightness = look_for_param(self.values, "brightness")
        if(brightness and "current_brightness" in values):
            brightness.value = values["current_brightness"]
        mode = look_for_param(self.values, "night_light")
        if(mode and "active_mode" in values):
            mode.value = values["active_mode"]
        temp = look_for_param(self.values, "temp")
        if(temp and "ct" in values):
            temp.value = values["ct"]
        color = look_for_param(self.values, "color")
        if(color and "hue" in values):
            color.value = values["hue"]
        saturation = look_for_param(self.values, "saturation")
        if(saturation and "sat" in values):
            saturation.value = values["sat"]


    def get_value(self, name):
        self.update_value()
        return super().get_value(name)

    def get_values(self):
        self.update_value()
        return super().get_values()

    def set_value(self, name, status):
        status = super().set_value(name, status)
        print(name, status)
        if(name == "state"):
            if(status==1):
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
            self.device.set_hsv(int(status), int(saturation.value))
        if(name == "saturation"):
            self.device.set_power_mode(PowerMode.HSV)
            color = look_for_param(self.values, "color")
            self.device.set_hsv(int(color.value), int(status))



    def get_All_Info(self):
        self.update_value()
        return super().get_All_Info()
