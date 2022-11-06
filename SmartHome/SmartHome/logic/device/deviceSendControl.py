from settings import configManager
from SmartHome.logic.call_functions import RunFunctions
from SmartHome.logic.device.sendDevice import sendDevice

async def updataSendTime():
    base = configManager.getConfig("base")
    RunFunctions.subscribe("devices", sendDevice, int(base['frequency']))
