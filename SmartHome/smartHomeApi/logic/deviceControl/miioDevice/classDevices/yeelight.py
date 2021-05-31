from yeelight import Bulb,PowerMode
from smartHomeApi.logic.deviceValue import deviceSetStatus

class Yeelight(Bulb):

    def __init__(self, *args, **kwargs):
        self.__item = kwargs
        self.address = kwargs["address"]
        super().__init__(self.address)
        config1 = self.get_properties()
        config2 = self.get_model_specs()
        print("config1",config1)
        print("config2",config2)
        self.__control_power = True
        self.__control_dimmer = True
        self.__control_dimmer_min = 0
        self.__control_dimmer_max = 100
        if config2["color_temp"]:
            self.__control_temp = True
            temp = config2["color_temp"]
            self.__control_temp_min = temp["min"]
            self.__control_temp_max = temp["max"]
        else:
            self.__control_temp = False

        if config2["night_light"]:
            self.__control_mode = 2;
        else:
            self.__control_mode = 1;

        if config1["rgb"]:
            self.__control_color = True;
        else:
            self.__control_color = False;

    def get_control(self):
        controls = dict()
        if(self.__control_power):
            controls["power"] = self.__control_power
        if(self.__control_dimmer):
            controls["dimmer"]={
            "min": self.__control_dimmer_min,
            "max": self.__control_dimmer_max
            }
        if(self.__control_temp):
            controls["temp"]={
            "min": self.__control_temp_min,
            "max": self.__control_temp_max
            }
        if(self.__control_mode>1):
            controls["mode"]=self.__control_mode
        if(self.__control_color):
            controls["color"] = self.__control_color
        return controls

    def get_value(self,save=True):
        val = self.get_properties()
        values={
        "power":val["power"],
        "temp":val["ct"],
        "color":val["rgb"],
        "mode":val["active_mode"],
        "bg_power":val["bg_power"],
        "bg_dimmer":val["bg_bright"],
        "bg_temp":val["bg_ct"],
        "bg_color":val["bg_rgb"],
        "bg_mode":val["nl_br"],
        }
        if(val["current_brightness"]):
            values["dimmer"]=val["current_brightness"]
        else:
            values["dimmer"]=val["bright"]

        if(values["power"]=="on"):
            values["power"] = "1"
        elif(values["power"]=="off"):
            values["power"] = "0"

        if(save):
            for item2 in values:
                deviceSetStatus(self.__item["DeviceId"],item2,values[item2])

        return values

    def on(self):
        self.turn_on()

    def off(self):
        self.turn_off()

    def set_mode(self,status):
        if(status==1):
            self.set_power_mode(PowerMode.MOONLIGHT)
        if(status==0):
            self.set_power_mode(PowerMode.NORMAL)
