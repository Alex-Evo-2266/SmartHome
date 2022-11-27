from ..devicesArrey import DevicesArrey

async def saveDevice():
    devices = DevicesArrey.all()
    for item in devices:
        dev = item["device"]
        await dev.save_and_addrecord()
