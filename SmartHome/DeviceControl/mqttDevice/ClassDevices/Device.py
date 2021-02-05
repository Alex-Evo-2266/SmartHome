from smartHomeApi.logic.devices import deviceValue
from DeviceControl.mqttDevice.connect import connect

class Device():

    def __init__(
    self,
    DeviceId: str = None,
    DeviceName: str = None,
    DeviceSystemName: str = None,
    DeviceInformation: str = None,
    DeviceType: str = None,
    DeviceTypeConnect: str = None,
    DeviceConfig: list = [],
    RoomId:str = None
    ):
        self.DeviceId = DeviceId
        self.DeviceName = DeviceName
        self.DeviceSystemName = DeviceSystemName
        self.DeviceInformation = DeviceInformation
        self.DeviceType = DeviceType
        self.DeviceTypeConnect = DeviceTypeConnect
        self.DeviceConfig = DeviceConfig
        self.RoomId = RoomId
        for item in DeviceConfig:
            if item["type"]=="status":
                self.statustoken = item["address"]
            if item["type"]=="command":
                self.commandtoken = item["address"]

    def get_properties(self, properties):
        d = dict()
        for item in properties:
            for item2 in self.DeviceConfig:
                if(item == item2["type"]):
                    d = {**d,item:deviceValue(self.DeviceId, item)}
        return d

    def send(self,topic:str, command: str):
        client = connect()
        client.publish(topic, command)

    def sendCommand(self, command:str):
        send(self.commandtoken,command)
