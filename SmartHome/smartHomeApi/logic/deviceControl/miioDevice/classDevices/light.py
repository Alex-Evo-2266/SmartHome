from yeelight import Bulb

class Light(Bulb):

    def __init__(self, *args, **kwargs):
        for item in kwargs["DeviceConfig"]:
            if item["type"]=="base":
                super().__init__(item["address"])    

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
