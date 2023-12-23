from moduls_src.pages import LincDevice, TypeDeviceField, DeviceConfig, LincDeviceOut, TypeMessage
from ..MQTTDevice import MQTTDevice as Mqtt
import json

def lincDecice(data:LincDevice)->LincDeviceOut:
    device = data.device
    print(device)
    fields = []
    try:
        message = json.loads(device["message"])
    except:
        message =  device["message"]
    if type(message) == type(dict()):
        valueType = TypeMessage.JSON
        address = device["topic"]
        for key in message:
            fields.append(DeviceConfig(
                name=key,
                address=key,
                type=TypeDeviceField.TEXT
            ))
    else:
        valueType = TypeMessage.TEXT
        address = device["topic"].split('/')
        fname = "/"
        print(address)
        if len(address) == 1:
            address = address[0]
        else:
            fname = address[-1]
            address = address[:-1]
            address = "/".join(address)
        fields.append(DeviceConfig(
            name=fname,
            address=fname,
            type=TypeDeviceField.TEXT
        ))
    print(address,fname)
    out = LincDeviceOut(
        typeConnect="mqtt",
        address=address,
        valueType=valueType,
        config=fields
        )
    return out
