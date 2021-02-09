# from DeviceControl.miioDevice.definition import is_device, type_device
from .device import MqttDevice
class MqttDimmer(MqttDevice):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for item in self.DeviceConfig:
            if item["type"]=="power":
                self.powertoken = item["address"]
                self.powerOn = item["high"]
                self.powerOff = item["low"]
            if item["type"]=="dimmer":
                self.brightnesstoken = item["address"]
                self.brightnessMax = int(item["high"])
                self.brightnessMin = int(item["low"])

    def on(self, mode=0):
        if(mode>=0 and mode<self.modecount):
            self.send(self.powertoken,self.powerOn)
            self.send(self.modetoken,mode)

    def off(self):
        self.send(self.powertoken,self.powerOff)

    def set_brightness(self, lavel):
        if(lavel>=self.brightnessMin and lavel<self.brightnessMax):
            self.send(self.brightnesstoken,lavel)

    def controlDevice(self):
        arr = MqttDevice.controlDevice(self)
        if(self.powertoken):
            arr.append("power")
        if(self.brightnesstoken):
            arr.append("dimmer")
        return arr

    def get_value(self):
        prop=[
        "status",
        "power",
        "dimmer"
        ]
        return self.get_properties(prop)
