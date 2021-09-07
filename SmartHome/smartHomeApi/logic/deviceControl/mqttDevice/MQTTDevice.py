from smartHomeApi.logic.deviceValue import deviceSetStatusThread
from smartHomeApi.models import Device,Room,genId,ValueDevice
from ..BaseDeviceClass import BaseDevice
from ..DeviceElement import DeviceElement
from .connect import getMqttClient

def look_for_param(arr:list, val):
    for item in arr:
        if(param is item && item.name == val):
            return(item)
    return None

def look_for_by_topic(arr:list, val):
    for item in arr:
        if(param is item && item.address == val):
            return(item)
    return None

# def createValue()

class MQTTDevice(BaseDevice):

    def __init__(self, *args, **kwargs):
        super(, self).__init__(**kwargs)

    def update_value(self, *args, **kwargs):
        topic = kwargs["topic"]
        value = kwargs["value"]

        val = look_for_by_topic(self.values, topic)
        val.value = value

    def set_value(self, name, status):
        client = getMqttClient()
        message = ""
        val = look_for_param(self.values, name)
        if(val.type=="binary"):
            if(int(status)==1):
                message = val.high
            else:
                message = val.low
        elif(val.type=="number"):
            if(int(status)>int(val.high)):
                message = int(val.high)
            elif(int(status)<int(val.low)):
                message = int(val.low)
            else:
                message = status
        else:
            message = status
        if(self.valueType=="json"):
            data = dict()
            data[val.topic] = message
            data = json.dumps(data)
            client.publish(self.address+"/set", data)
        else:
            alltopic = self.address + "/" + val.topic
            client.publish(alltopic, message)

        super().set_value(name, status)
