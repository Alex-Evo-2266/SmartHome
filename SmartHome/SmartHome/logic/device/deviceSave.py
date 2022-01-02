from .devicesArrey import devicesArrey

async def saveDevice():
    devices = devicesArrey.all()
    for item in devices:
        dev = item["device"]
        dev.save()
