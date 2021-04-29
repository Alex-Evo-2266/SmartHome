# from DeviceControl.miioDevice.definition import is_device, type_device
from .device import MqttDevice
class MqttLight(MqttDevice):

    def __init__(self, *args, **kwargs):
        self.modetoken=None
        self.modecount=None
        self.powertoken=None
        self.brightnesstoken=None
        self.colortoken=None
        self.temptoken=None

        super().__init__(*args, **kwargs)
        for item in self.DeviceConfig:
            if item["type"]=="power":
                self.powertoken = item["address"]
                self.powerOn = item["high"]
                self.powerOff = item["low"]
            if item["type"]=="dimmer":
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
        if(self.modetoken and self.modecount):
            if(mode>=0 and mode<int(self.modecount)):
                self.send(self.powertoken,self.powerOn)
                self.send(self.modetoken,mode)
                return
        self.send(self.powertoken,self.powerOn)

    def off(self):
        self.send(self.powertoken,self.powerOff)

    def set_brightness(self, lavel):
        if(lavel>=int(self.brightnessMin) and lavel<=int(self.brightnessMax)):
            print(self.brightnesstoken)
            self.send(self.brightnesstoken,lavel)

    def set_color_temp(self, lavel):
        if(lavel>=int(self.tempMin) and lavel<=int(self.tempMax)):
            self.send(self.temptoken,lavel)

    def set_rgb(self,lavel):
        if(lavel>=self.colorMin and lavel<=self.colorMax):
            self.send(self.colortoken,lavel)

    def set_mode(self,lavel):
        if(lavel>=0 and lavel<int(self.modecount)):
            self.send(self.modetoken,lavel)

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

    def get_control(self):
        controls = {
        "status":True,
        }
        if(self.powertoken):
            controls["power"] = True
        if(self.brightnesstoken):
            controls["dimmer"]={
            "min": self.brightnessMin,
            "max": self.brightnessMax
            }
        if(self.temptoken):
            controls["temp"]={
            "min": self.tempMin,
            "max": self.tempMax
            }
        if(self.modetoken):
            controls["mode"]=self.modecount
        if(self.colortoken):
            controls["color"] = True
        return controls
