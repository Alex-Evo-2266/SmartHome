from app.device.devices_arrey import DevicesArrey
# from SmartHome.logic.deviceClass.interfaces.device_save_interface import ISaveDevice
from app.websocket import WebSocketMenager

async def save_device():
    devices = DevicesArrey.all()
    for item in devices:
        # dev:ISaveDevice = item.device
        dev = item.device
        await dev.save_and_addrecord()
    await WebSocketMenager.send_information("save_device", "success")
