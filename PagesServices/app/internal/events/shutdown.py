import logging
from app.pkg import __config__
from app.internal.listener.listener import loadServiceData, loadDeviceData
from app.internal.senderPoll.sender import sender_service

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()
	loadServiceData.stop()
	loadDeviceData.stop()

	sender_service.disconnect()

	logger.info("stop")
