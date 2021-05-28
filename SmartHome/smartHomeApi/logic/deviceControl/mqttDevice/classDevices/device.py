from smartHomeApi.logic.deviceValue import devicestatus
from ..connect import getMqttClient
import json

class MqttDevice():

    def __init__(self, *args, **kwargs):
        self.DeviceId = kwargs["DeviceId"]
        self.DeviceName = kwargs["DeviceName"]
        self.DeviceSystemName = kwargs["DeviceSystemName"]
        self.DeviceInformation = kwargs["DeviceInformation"]
        self.DeviceType = kwargs["DeviceType"]
        self.DeviceTypeConnect = kwargs["DeviceTypeConnect"]
        self.DeviceValueType = kwargs["DeviceValueType"]
        self.DeviceConfig = kwargs["DeviceConfig"]
        self.address = kwargs["address"]
        self.RoomId = kwargs["RoomId"]
        for item in self.DeviceConfig:
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
        client = getMqttClient()
        if(self.DeviceValueType=="json"):
            print(command)
            data = dict()
            data[topic] = command
            data = json.dumps(data)
            print(data)
            client.publish(self.address+"/set", data)
        else:
            print(client,command)
            alltopic = self.address + "/" + topic
            print(alltopic)
            client.publish(alltopic, command)

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
