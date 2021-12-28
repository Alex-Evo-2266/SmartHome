from .Yeelight import Yeelight
from castom_moduls import ModelData, DeviceData, TypeDevice

def getInfo():
    return ModelData(
        name="yeelight",
        dependencies=[],
        deviceType=[DeviceData(
            name="yeelight",
            deviceClass=Yeelight,
            typeDevices=["light"]
        )]
    )

def init():
    return getInfo()
