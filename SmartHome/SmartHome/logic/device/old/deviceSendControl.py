from settings import configManager
from SmartHome.logic.call_functions import RunFunctions
from SmartHome.SmartHome.logic.device.send_device import send_device

async def updata_send_time():
    base = configManager.getConfig("base")
    if not base:
        raise Exception("not base config")
    RunFunctions.subscribe("devices", send_device, int(base['frequency']))
