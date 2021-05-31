from .device import MqttDevice

class MqttRelay(MqttDevice):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for item in self.DeviceConfig:
            if item["type"]=="power":
                self.powertoken = item["address"]
                self.powerOn = item["high"]
                self.powerOff = item["low"]

    def on(self, mode=0):
        self.send(self.powertoken,"1")

    def off(self):
        self.send(self.powertoken,"0")

    def controlDevice(self):
        arr = MqttDevice.controlDevice(self)
        if(self.powertoken):
            arr.append("power")
        return arr

    def get_value(self):
        prop=[
        "status",
        "power"
        ]
        return self.get_properties(prop)

    def get_control(self):
        controls = dict()
        if(self.powertoken):
            controls["power"]=True
        return controls
