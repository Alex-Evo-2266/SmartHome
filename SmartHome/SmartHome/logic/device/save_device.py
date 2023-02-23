from SmartHome.logic.device.devices_arrey import DevicesArrey
from SmartHome.logic.deviceClass.interfaces.device_save_interface import ISaveDevice

async def save_device():
    devices = DevicesArrey.all()
    for item in devices:
        dev:ISaveDevice = item.device
        await dev.save_and_addrecord()
