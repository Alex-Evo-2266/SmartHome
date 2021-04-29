from smartHomeApi.logic.deviceValue import devicestatus
from ..connect import connect

class MqttDevice():

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
                    d = {**d,item:devicestatus(self.DeviceId, item)}
        return d

    def send(self,topic:str, command: str):
        client = connect()
        print(command)
        client.publish(topic, command)

    def sendCommand(self, command:str):
        send(self.commandtoken,command)

    def get_value(self):
        prop=[
        "status"
        ]
        return self.get_properties(prop)

    def controlDevice(self):
        arr = list()
        if(self.statustoken):
            arr.append("status")
        if(self.commandtoken):
            arr.append("command")
        return arr

    def get_control(self):
        controls = {
        "status":True,
        "send":True
        }
        return controls
