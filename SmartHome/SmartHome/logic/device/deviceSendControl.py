from settings import configManager
from SmartHome.logic.call_functions import call_functions
from SmartHome.logic.device.sendDevice import sendDevice

async def updataSendTime():
    base = configManager.getConfig("base")
    call_functions.subscribe("devices", sendDevice, int(base['frequency']))
