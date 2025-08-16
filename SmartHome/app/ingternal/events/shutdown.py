import logging

from app.pkg import __config__
from app.configuration.loop.loop import loop
from app.ingternal.senderPoll.sender import sender_service, sender_device, sender_script, sender_room
from app.ingternal.listener.listener import loadServiceData, loadDeviceData

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()
	loop.stop()
	sender_service.disconnect()
	sender_device.disconnect()
	sender_room.disconnect()
	sender_script.disconnect()
	loadServiceData.stop()
	loadDeviceData.stop()

	logger.info("stop")
