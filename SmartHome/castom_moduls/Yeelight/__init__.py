import os
from .Yeelight import Yeelight
from castom_moduls import ModelData, DeviceData, TypeDevice

def installdepModule():
    os.system("poetry add yeelight")

def getInfo():
    return ModelData(
        name="yeelight",
        router=None,
        dependencies=[],
        deviceType=[DeviceData(
            name="yeelight",
            deviceClass=Yeelight,
            typeDevices=["light"]
        )]
    )

def init():
    return getInfo()
