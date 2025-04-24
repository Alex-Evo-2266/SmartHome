import logging

from app.pkg import __config__
from app.configuration.loop.loop import loop
from app.ingternal.senderPoll.sender import sender_service, sender_device
from app.ingternal.poll.deviceGetData import loadServiceData

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()
	loop.stop()
	sender_service.disconnect()
	sender_device.disconnect()
	loadServiceData.disconnect()

	logger.info("stop")
