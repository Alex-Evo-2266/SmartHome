from DeviceControl.mqttDevice.classDevices.dimmer import MqttDimmer
from DeviceControl.mqttDevice.classDevices.device import MqttDevice
from DeviceControl.mqttDevice.classDevices.light import MqttLight
from DeviceControl.mqttDevice.classDevices.relay import MqttRelay
from DeviceControl.mqttDevice.classDevices.sensor import MqttSensor
from yeelight import Bulb ,PowerMode
from miio import Device,Yeelight,DeviceError,DeviceException
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


class ControlDevices():



    def __init__(self, item,configs):
        self.device = None
        self.__control_power = None
        self.__control_dimmer = None
        self.__control_dimmer_min = None
        self.__control_dimmer_max = None
        self.__control_temp = None
        self.__control_temp_min = None
        self.__control_temp_max = None
        self.__control_mode = None
        self.__control_color = None
        self.__item = item
        self.__configs = configs
        try:
            if(item["DeviceTypeConnect"]=="miio"):
                ret = self.config(type="base")
                if(item["DeviceType"]=="light"):
                    print("b")
                    self.device = Bulb(ret["address"])
                    print(self.device)
                    conf2 = self.device.get_properties()
                    print("1")
                    self.__control_power = True
                    self.__control_dimmer = True
                    self.__control_dimmer_min = 0
                    self.__control_dimmer_max = 100
                    conf = self.device.get_model_specs()
                    print("2")
                    if conf["color_temp"]:
                        self.__control_temp = True
                        temp = conf["color_temp"]
                        self.__control_temp_min = temp["min"]
                        self.__control_temp_max = temp["max"]
                    else:
                        self.__control_temp = False
                    if conf["night_light"]:
                        self.__control_mode = 2;
                    else:
                        self.__control_mode = 1;
                    if conf2["rgb"]:
                        self.__control_color = True;
                    else:
                        self.__control_color = False;
                else:
                    self.device = is_device(ret["address"],ret["token"])
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
                for item2 in configs:
                    if(item2["type"]=="power"):
                        self.__control_power = True
                    if(item2["type"]=="dimmer"):
                        self.__control_dimmer = True
                        self.__control_dimmer_min = item2["low"]
                        self.__control_dimmer_max = item2["high"]
                    if(item2["type"]=="temp"):
                        self.__control_temp = True
                        self.__control_temp_min = item2["low"]
                        self.__control_temp_max = item2["high"]
                    if(item2["type"]=="mode"):
                        self.__control_mode = int(item2["high"])
                    if item2["type"]=="color":
                        self.__control_color = True;
        except:
            self.device = None

    def __str__(self):
        return str(self.device)

    def get_device(self):
        # забрать само устройство
        return self.device

    def get_control(self):
        control = {
        "status": True
        }
        control["power"] = self.__control_power
        if self.__control_dimmer :
            control["dimmer"]={"min": self.__control_dimmer_min, "max": self.__control_dimmer_max}
        else:
            control["dimmer"]=False
        if self.__control_temp :
            control["temp"]={"min": self.__control_temp_min, "max": self.__control_temp_max}
        else:
            control["temp"]=False
        control["color"] = self.__control_color
        if type(self.__control_mode)==int and self.__control_mode > 1:
            control["mode"] = self.__control_mode
        else:
            control["mode"] = None
        return control

    def get_list_control(self):
        c = self.get_control()
        arr = list()
        for key in c:
            if(c[key]):
                arr.append(key)
        return arr

    def get_value(self, save=True):
        if(type(self.device)==Bulb):
            val = self.device.get_properties()
            values={
            "power":val["power"],
            "temp":val["ct"],
            "color":val["rgb"],
            "mode":val["active_mode"],
            "background":{
                "power":val["bg_power"],
                "dimmer":val["bg_bright"],
                "temp":val["bg_ct"],
                "color":val["bg_rgb"],
                "mode":val["nl_br"],
                }
            }
            if(val["current_brightness"]):
                values["dimmer"]=val["current_brightness"]
            else:
                values["dimmer"]=val["bright"]
            for item2 in values:
                deviceSetStatus(self.__item["DeviceId"],item2,values[item2])
            return values
        elif self.__item["DeviceTypeConnect"]=="mqtt":
            return self.device.get_value()
        else:
            return None


    def config(self ,**kwargs):
        for item in self.__configs:
            if(item["type"]==kwargs["type"]):
                return item
        return None

    def set_power(self,status):
        if(type(self.device)==Bulb):
            if(status==1):
                self.device.turn_on()
            else:
                self.device.turn_off()
        elif self.__item["DeviceTypeConnect"]=="mqtt":
            if(status==1):
                self.device.on()
            else:
                self.device.off()

    def set_mode(self, status):
        if(type(self.device)==Bulb):
            if(status==1):
                self.device.set_power_mode(PowerMode.MOONLIGHT)
            if(status==0):
                self.device.set_power_mode(PowerMode.NORMAL)
        elif self.__item["DeviceTypeConnect"]=="mqtt":
            self.device.set_mode(status)

    def set_dimmer(self, status):
        try:
            if(type(self.device)==Bulb or self.__item["DeviceTypeConnect"]=="mqtt"):
                self.device.set_brightness(int(status))
                return True
            return False
        except:
            return False

    def set_temp(self, status):
        try:
            if(type(self.device)==Bulb or self.__item["DeviceTypeConnect"]=="mqtt"):
                self.device.set_color_temp(int(status))
                return True
            return False
        except:
            return False


    # def __str__(self)
