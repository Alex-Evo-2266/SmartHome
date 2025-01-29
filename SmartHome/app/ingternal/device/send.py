import logging
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.configuration.loop.loop import loop
from app.pkg.websoket.websocket import WebSocketMenager
from app.pkg import __config__
from app.configuration.settings import TYPE_SEND_DEVICE, SEND_DEVICE_CONF, LOOP_SEND_DEVICE, DEVICE_DATA_POLL

logger = logging.getLogger(__name__)

async def send_device_data():
	devices:DeviceRegistry | None = servicesDataPoll.get(DEVICE_DATA_POLL)
	if not devices:
		logger.warning("not devices structure")
		return
	schemas = devices.get_all_devices()
	await WebSocketMenager.send_information(TYPE_SEND_DEVICE, schemas)
	print('device send')

async def restart_send_device_data():
	logger.info('restart_send')
	item = __config__.get(SEND_DEVICE_CONF)
	if item and item.value:
		loop.register(LOOP_SEND_DEVICE, send_device_data, int(item.value))
	else:
		loop.register(LOOP_SEND_DEVICE, send_device_data, 6)