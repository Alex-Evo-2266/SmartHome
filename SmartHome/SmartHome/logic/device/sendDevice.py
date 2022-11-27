
from SmartHome.logic.device.get_device import get_all_device
from SmartHome.websocket import WebSocketMenager

async def sendDevice():
    print("p0")
    devices = get_all_device()
    print(devices)
    devicesdict = list()
    for item in devices:
        if item:
            devicesdict.append(item.dict())
        else:
            devicesdict.append(None)
    print(devicesdict)
    await WebSocketMenager.send_information("devices", devicesdict)
