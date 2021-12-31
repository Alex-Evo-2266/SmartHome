from SmartHome.logic.device.getdevice import giveDevices
from SmartHome.websocket.manager import manager

async def sendDevice():
    devices = await giveDevices()
    devicesdict = list()
    for item in devices:
        devicesdict.append(item.dict())
    await manager.send_information("devices", devicesdict)
