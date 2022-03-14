from SmartHome.models import DeviceHistory
from .DeviceFile import Devices
from SmartHome.schemas.base import FunctionRespons, TypeRespons
from typing import List

async def getHistory(systemName:str)->FunctionRespons:
    dev = Devices.get(systemName=systemName)
    if not dev:
        return FunctionRespons(status=TypeRespons.ERROR, detail="device not found")
    history = await DeviceHistory.objects.all(deviceName=systemName)
    return FunctionRespons(status=TypeRespons.OK, data=history)
