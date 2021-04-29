from .mqttDevice.classDevices.dimmer import MqttDimmer
from .mqttDevice.classDevices.device import MqttDevice
from .mqttDevice.classDevices.light import MqttLight
from .mqttDevice.classDevices.relay import MqttRelay
from .mqttDevice.classDevices.sensor import MqttSensor
from .miioDevice.classDevices.yeelight import Yeelight
from .system.variable import Variable
from yeelight import Bulb ,PowerMode
from miio import Device,DeviceError,DeviceException
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

# def config(**kwargs):
#     for item in kwargs["configs"]:
#         if(item["type"]==kwargs["type"]):
#             return item
#     return None

# def deviceObject(item,configs):


# ret = self.config(type="base")
# if(item["DeviceType"]=="light"):
#     self.device = Bulb(ret["address"])
#     # print(self.device)
#     # print(self.device.get_properties())
#     conf2 = self.device.get_properties()
#     self.__control_power = True
#     self.__control_dimmer = True
#     self.__control_dimmer_min = 0
#     self.__control_dimmer_max = 100
#     conf = self.device.get_model_specs()
#     if conf["color_temp"]:
#         self.__control_temp = True
#         temp = conf["color_temp"]
#         self.__control_temp_min = temp["min"]
#         self.__control_temp_max = temp["max"]
#     else:
#         self.__control_temp = False
#     if conf["night_light"]:
#         self.__control_mode = 2;
#     else:
#         self.__control_mode = 1;
#     if conf2["rgb"]:
#         self.__control_color = True;
#     else:
#         self.__control_color = False;
# else:
#     self.device = is_device(ret["address"],ret["token"])


class ControlDevices():

    def __init__(self, item,configs):
        self.device = None
        self.__item = item
        self.__configs = configs
        try:
            if(item["DeviceTypeConnect"]=="miio"):
                if(item["DeviceType"]=="light"):
                    self.device = Yeelight(**item, DeviceConfig=configs)
            elif(item["DeviceTypeConnect"]=="mqtt"):
                if(item["DeviceType"]=="light"):
                    self.device = MqttLight(**item, DeviceConfig=configs)
                elif(item["DeviceType"]=="switch"):
                    self.device = MqttRelay(**item, DeviceConfig=configs)
                elif(item["DeviceType"]=="dimmer"):
                    self.device = MqttDimmer(**item, DeviceConfig=configs)
                elif(item["DeviceType"]=="sensor"):
                    self.device = MqttSensor(**item, DeviceConfig=configs)
                else:
                    self.device = MqttDevice(**item, DeviceConfig=configs)
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
        if self.__item["DeviceTypeConnect"]=="miio":
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

    def set_value(self,status)->None:
        if(type(self.device)==Variable):
            deviceSetStatus(self.__item["DeviceId"],"value",status)
            # self.device.set_value(status)

    def set_power(self,status):
        if(status==1):
            self.device.on()
        else:
            self.device.off()

    def set_mode(self, status):
        self.device.set_mode(status)

    def target_mode(self):
        status = int(self.get_value(False)["mode"])
        control = self.device.get_control()["mode"]
        status += 1
        if(status>control-1):
            status = 0
        self.set_mode(status)

    def set_dimmer(self, status):
        # print(status)
        try:
            if(type(self.device)==Yeelight or self.__item["DeviceTypeConnect"]=="mqtt"):
                self.device.set_brightness(int(status))
                return True
            return False
        except:
            return False

    def set_temp(self, status):
        try:
            if(type(self.device)==Yeelight or self.__item["DeviceTypeConnect"]=="mqtt"):
                self.device.set_color_temp(int(status))
                return True
            return False
        except:
            return False


    # def __str__(self)
