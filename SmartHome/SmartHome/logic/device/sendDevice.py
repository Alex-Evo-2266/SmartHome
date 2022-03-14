from SmartHome.logic.device.getdevice import giveDevices
from SmartHome.websocket.manager import manager

async def sendDevice():
    devices = await giveDevices()
    devicesdict = list()
    for item in devices:
        if item:
            devicesdict.append(item.dict())
        else:
            devicesdict.append(None)
    await manager.send_information("devices", devicesdict)
