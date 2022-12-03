
from SmartHome.logic.call_functions import RunFunctions
from SmartHome.logic.device.get_device import get_all_device
from SmartHome.websocket import WebSocketMenager
from settings import configManager

async def send_device():
	devices = get_all_device()
	devicesdict = list()
	for item in devices:
		if item:
			devicesdict.append(item.dict())
		else:
			devicesdict.append(None)
	await WebSocketMenager.send_information("devices", devicesdict)


async def send_restart():
	base = configManager.getConfig("send_message")
	if "frequency" in base:
		RunFunctions.subscribe("devices", send_device, int(base['frequency']))
	else:
		RunFunctions.subscribe("devices", send_device, 6)