from .mqttDevice.classDevices.device import MqttDevice
from .miioDevice.classDevices.yeelight import Yeelight
from .system.variable import Variable
from yeelight import Bulb ,PowerMode
from miio import Device,DeviceError,DeviceException
# from smartHomeApi.logic.runScript import runScripts
from smartHomeApi.logic.deviceValue import deviceSetStatus

def is_device(ip, token):
    try:
        device = Device(ip,token)
        return device
    except:
        return None

def model_device(ip, token):
    ret = is_device(ip, token)
    if(not ret):
        return None
    model = ret.info().model
    type = model.split(".")[0]
    return type

class ControlDevices():

    def __init__(self, item,config,configs_value):
        self.device = None
        self.__item = item
        self.__address = config["address"]
        self.__token = None
        if "token" in config:
            self.__token = config["token"]
        self.__configs = configs_value
        try:
            if(item["DeviceTypeConnect"]=="yeelight"):
                if(item["DeviceType"]=="light"):
                    self.device = Yeelight(**item, address=self.__address, DeviceConfig=self.__configs)
            elif(item["DeviceTypeConnect"]=="mqtt"):
                self.device = MqttDevice(**item, address=self.__address, DeviceConfig=self.__configs)
            elif(item["DeviceTypeConnect"]=="system"):
                if(item["DeviceType"]=="variable"):
                    self.device = Variable(**item)
        except Exception as e:
            print(e)
            self.device = None

    def __str__(self):
        return str(self.device)

    def get_device(self):
        return self.device

    def get_control(self):
        return self.device.get_control()

    def get_list_control(self):
        c = self.get_control()
        arr = list()
        for key in c:
            if(c[key]):
                arr.append(key)
        return arr

    def get_value(self, save=True):
        # runScripts(self.__item["DeviceId"],"all")
        if self.__item["DeviceTypeConnect"]=="miio":
            return self.device.get_value(save)
        if self.__item["DeviceTypeConnect"]=="yeelight":
            return self.device.get_value(save)
        elif self.__item["DeviceTypeConnect"]=="mqtt":
            return self.device.get_value()
        elif self.__item["DeviceTypeConnect"]=="system" and self.__item["DeviceType"]=="variable":
            return self.device.get_value()
        else:
            return None

    def config(self ,**kwargs):
        for item in self.__configs:
            if(item["type"]==kwargs["type"]):
                return item
        return None

    def set_status(self,type,status):
        print("setStatus",type,status)
        if self.__item["DeviceTypeConnect"]=="yeelight":
            self.device.runCommand(type,status)
        if self.__item["DeviceTypeConnect"]=="mqtt":
            self.device.runCommand(type,status)

    def set_value(self,status)->None:
        if(type(self.device)==Variable):
            deviceSetStatus(self.__item["DeviceId"],"value",status)
            # self.device.set_value(status)

    # def __str__(self)
