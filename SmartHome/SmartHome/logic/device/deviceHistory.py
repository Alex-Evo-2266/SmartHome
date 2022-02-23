from SmartHome.models import DeviceHistory
from .DeviceFile import Devices
from SmartHome.schemas.base import FunctionRespons
from typing import List

async def getHistory(systemName:str)->FunctionRespons:
    dev = Devices.get(systemName=systemName)
    if not dev:
        return FunctionRespons(status="error", detail="device not found")
    history = await DeviceHistory.objects.all(deviceName=systemName)
    return FunctionRespons(status="ok", data=history)
