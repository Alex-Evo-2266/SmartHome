# from DeviceControl.miioDevice.definition import is_device, type_device
from .device import MqttDevice
class MqttLight(MqttDevice):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for item in self.DeviceConfig:
            if item["type"]=="power":
                self.powertoken = item["address"]
                self.powerOn = item["high"]
                self.powerOff = item["low"]
            if item["type"]=="lavel":
                self.brightnesstoken = item["address"]
                self.brightnessMax = item["high"]
                self.brightnessMin = item["low"]
            if item["type"]=="color":
                self.colortoken = item["address"]
                self.colorMax = item["high"]
                self.colorMin = item["low"]
            if item["type"]=="temp":
                self.temptoken = item["address"]
                self.tempMax = item["high"]
                self.tempMin = item["low"]
            if item["type"]=="mode":
                self.modetoken = item["address"]
                self.modecount = item["high"]

    def on(self, mode=0):
        if(mode>=0 and mode<self.modecount):
            self.send(self.powertoken,self.powerOn)
            self.send(self.modetoken,mode)

    def off(self):
        self.send(self.powertoken,self.powerOff)

    def set_brightness(self, lavel):
        if(lavel>=self.brightnessMin and lavel<self.brightnessMax):
            self.send(self.brightnesstoken,lavel)

    def set_color_temp(self, lavel):
        if(lavel>=self.tempMin and lavel<self.tempMax):
            self.send(self.temptoken,lavel)

    def set_rgb(self,lavel):
        if(lavel>=self.colorMin and lavel<self.colorMax):
            self.send(self.colortoken,lavel)

    def controlDevice(self):
        arr = MqttDevice.controlDevice(self)
        if(self.powertoken):
            arr.append("power")
        if(self.brightnesstoken):
            arr.append("dimmer")
        if(self.colortoken):
            arr.append("color")
        if(self.temptoken):
            arr.append("temp")
        if(self.modetoken):
            arr.append("mode")
        return arr

    def get_value(self):
        prop=[
        "status",
        "power",
        "dimmer",
        "mode",
        "temp",
        "color"
        ]
        return self.get_properties(prop)
