from .Device import MqttDevice

class Relay(MqttDevice):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for item in self.DeviceConfig:
            if item["type"]=="power":
                self.powertoken = item["address"]
                self.powerOn = item["high"]
                self.powerOff = item["low"]

    def on(self, mode=0):
        if(mode>=0&&mode<self.modecount):
            self.send(self.powertoken,self.powerOn)
            self.send(self.modetoken,mode)

    def off(self):
        self.send(self.powertoken,self.powerOff)
