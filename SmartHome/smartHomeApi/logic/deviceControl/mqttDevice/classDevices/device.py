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


    def get_properties(self, properties):
        d = dict()
        for item in properties:
            for item2 in self.DeviceConfig:
                if(item == item2["type"]):
                    d = {**d,item:devicestatus(self.DeviceId, item)}
        return d

    def send(self,topic:str, command:str):
        client = getMqttClient()
        typeMessage = "text"
        min = 0
        max = 1
        message = ""
        for item in self.DeviceConfig:
            if(item["address"]==topic):
                typeMessage = item["typeControl"]
                min = item["low"]
                max = item["high"]
        if(typeMessage=="boolean"):
            if(int(command)==1):
                message = max
            else:
                message = min
        elif(typeMessage=="range"):
            if(int(command)>int(max)):
                message = int(max)
            elif(int(command)<int(min)):
                message = int(min)
            else:
                message = command
        else:
            message = command
        if(self.DeviceValueType=="json"):
            data = dict()
            data[topic] = message
            data = json.dumps(data)
            client.publish(self.address+"/set", data)
        else:
            alltopic = self.address + "/" + topic
            client.publish(alltopic, message)

    def runCommand(self,type:str, command:str):
        for item in self.DeviceConfig:
            if(item["type"]==type):
                self.send(item["address"],command)
                return


    def get_value(self):
        prop=[
        "status"
        ]
        return self.get_properties(prop)

    def controlDevice(self):
        arr = list()
        return arr

    def get_control(self):
        controls = dict()
        for item in self.DeviceConfig:
            controls[item["type"]]=True
        return controls
