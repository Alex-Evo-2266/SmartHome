from yeelight import Bulb,PowerMode
from smartHomeApi.logic.deviceValue import deviceSetStatus
from smartHomeApi.models import Device,Room,genId,ValueDevice

def createValue(id,type,min=0,max=1,icon=""):
    dev = Device.objects.get(id=id)
    valuesdb = dev.valuedevice_set.all()
    isField = True
    for item in valuesdb:
        if item.type == type:
            isField=False
    if(isField):
        typeControl = "boolean"
        if(type=="brightness" or type=="color" or type=="temp" or type=="bg_brightness" or type=="bg_temp" or type=="bg_color"):
            typeControl = "range"
        if(type=="mode" or type=="bg_mode"):
            typeControl = "number"
        val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,type=type,typeControl=typeControl,high=max,low=min,icon=icon)
        val.save()

class Yeelight(Bulb):

    def __init__(self, *args, **kwargs):
        self.__item = kwargs
        self.address = kwargs["address"]
        super().__init__(self.address)
        config1 = self.get_properties()
        config2 = self.get_model_specs()

        # field_init
        self.__is_power = True
        self.__is_dimmer = True
        self.__dimmer_min = 0
        self.__dimmer_max = 100
        self.__is_night_light = config2["night_light"]
        self.__is_background = config2["background_light"]
        if config2["color_temp"]:
            self.__is_color_temp = True
            temp = config2["color_temp"]
            self.__temp_min = temp["min"]
            self.__temp_max = temp["max"]
        else:
            self.__is_color_temp = False

        if config2["night_light"]:
            self.__mode = 2;
        else:
            self.__mode = 1;

        if config1["rgb"]:
            self.__is_color = True;
        else:
            self.__is_color = False;

        # create value field
        if self.__is_power:
            createValue(self.__item["DeviceId"],"power",0,1,"fas fa-power-off")
        if self.__is_dimmer:
            createValue(self.__item["DeviceId"],"brightness",self.__dimmer_min,self.__dimmer_max,"far fa-sun")
        if self.__is_night_light:
            createValue(self.__item["DeviceId"],"mode",0,2,"fab fa-medium-m")
        if self.__is_color_temp:
            createValue(self.__item["DeviceId"],"temp",self.__temp_min,self.__temp_max,"fas fa-adjust")
        if self.__is_color:
            createValue(self.__item["DeviceId"],"color",0,150,"fas fa-palette")
        if self.__is_background:
            createValue(self.__item["DeviceId"],"bg_power")
            createValue(self.__item["DeviceId"],"bg_brightness",0,100)
            createValue(self.__item["DeviceId"],"bg_temp",self.__temp_min,self.__temp_max)
            createValue(self.__item["DeviceId"],"bg_color",0,150)
            createValue(self.__item["DeviceId"],"bg_mode",0,2)


    def get_control(self):
        controls = dict()
        if(self.__is_power):
            controls["power"] = self.__is_power
        if(self.__is_dimmer):
            controls["brightness"]={
            "min": self.__dimmer_min,
            "max": self.__dimmer_max
            }
        if(self.__is_color_temp):
            controls["temp"]={
            "min": self.__temp_min,
            "max": self.__temp_max
            }
        if(self.__mode>1):
            controls["mode"]=self.__mode
        if(self.__is_color):
            controls["color"] = self.__is_color
        return controls

    def get_value(self,save=True):
        val = self.get_properties()
        values={
        "power":val["power"],
        "temp":val["ct"],
        }
        if self.__is_night_light:
            values["mode"]=val["active_mode"]
        if(self.__is_color):
            values["color"]=val["rgb"]
        if(self.__is_background):
            values["bg_power"]=val["bg_power"]
            values["bg_brightness"]=val["bg_bright"]
            values["bg_temp"]=val["bg_ct"]
            values["bg_color"]=val["bg_rgb"]
            values["bg_mode"]=val["nl_br"]
        if(val["current_brightness"]):
            values["brightness"]=val["current_brightness"]
        else:
            values["brightness"]=val["bright"]

        if(values["power"]=="on"):
            values["power"] = "1"
        elif(values["power"]=="off"):
            values["power"] = "0"
        if(save):
            for item2 in values:
                deviceSetStatus(self.__item["DeviceId"],item2,values[item2])

        return values

    def runCommand(self,type,command):
        # print(type,command)
        if type=="power":
            if(command==1):
                self.turn_on()
            else:
                self.turn_off()
        elif type=="brightness":
            self.set_brightness(int(command))
        elif type=="temp":
            self.set_color_temp(int(command))
        elif type=="color":
            print("WTF")
        elif type=="modeTarget":
            status = int(self.get_value(False)["mode"])
            control = self.__mode
            status += 1
            if(status>int(control)-1):
                status = 0
            self.set_mode(status)
        elif type=="mode":
            self.set_mode(int(command))

    def on(self):
        self.turn_on()

    def off(self):
        self.turn_off()

    def set_mode(self,status):
        if(status==1):
            self.set_power_mode(PowerMode.MOONLIGHT)
        if(status==0):
            self.set_power_mode(PowerMode.NORMAL)
