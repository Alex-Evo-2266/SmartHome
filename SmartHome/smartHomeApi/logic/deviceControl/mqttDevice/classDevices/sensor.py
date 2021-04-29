from .device import MqttDevice

class MqttSensor(MqttDevice):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for item in self.DeviceConfig:
            if item["type"]=="power":
                self.powertoken = item["address"]
                self.powerOn = item["high"]
                self.powerOff = item["low"]

    def status(self):
        properties=[
        "value",
        "battery"
        ]
        return get_properties(self, properties)

    def get_value(self):
        prop=[
        "status",
        "battery"
        ]
        return self.get_properties(prop)

    def get_control(self):
        controls = {
        "status":True,
        }
        return controls
