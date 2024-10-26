
from app.configuration.loop.loop import EventLoop
from app.ingternal.device.device_data.read_and_polling import get_all_device
from app.ingternal.device.device_data.device_data_array import DevicesDataArrey
from app.pkg.websoket.websocket import WebSocketMenager
from app.pkg import Config
from app.configuration.settings import FREQUENCY

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


async def send_restart(__config__: Config):
	frequency = __config__.get(FREQUENCY)
	if frequency and frequency.value.isdigit():
		EventLoop.register("devices", send_device, int(frequency.value))
	else:
		EventLoop.register("devices", send_device, 6)