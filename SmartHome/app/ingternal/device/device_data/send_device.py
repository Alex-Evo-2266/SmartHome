
from app.configuration.loop.loop import EventLoop
from app.ingternal.device.device_data.read_and_polling import get_all_device
from app.ingternal.device.device_data.device_data_array import DevicesDataArrey
from app.ingternal.websoket.websocket import WebSocketMenager
from app.configuration.config.config import ModuleConfig

async def send_device():
	print("send")
	devices = await get_all_device()
	devicesdict = list()
	for item in devices:
		if item:
			DevicesDataArrey.add_or_updata(item)
			devicesdict.append(item.dict())
		else:
			devicesdict.append(None)
	await WebSocketMenager.send_information("devices", devicesdict)
	await WebSocketMenager.send_information("devices_data", [x.dict() for x in DevicesDataArrey.get_all_device()])


async def send_restart(__module_config__: ModuleConfig):
	base = __module_config__.get_config("send_message")
	if base and "frequency" in base:
		EventLoop.register("devices", send_device, int(base['frequency']))
	else:
		EventLoop.register("devices", send_device, 6)