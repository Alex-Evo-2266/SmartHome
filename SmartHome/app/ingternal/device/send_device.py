
from app.configuration.loop.loop import EventLoop
from app.ingternal.device.CRUD import get_all_device
from app.ingternal.websoket.websocket import WebSocketMenager
from app.configuration.config import __module_config__

async def send_device():
	print("send")
	devices = await get_all_device()
	devicesdict = list()
	for item in devices:
		if item:
			devicesdict.append(item.dict())
		else:
			devicesdict.append(None)
	await WebSocketMenager.send_information("devices", devicesdict)


async def send_restart():
	base = __module_config__.get_config("send_message")
	if base and "frequency" in base:
		EventLoop.register("devices", send_device, int(base['frequency']))
	else:
		EventLoop.register("devices", send_device, 6)