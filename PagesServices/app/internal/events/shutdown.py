import logging
from app.pkg import __config__
from app.internal.poll.deviceGetData import loadServiceData, loadDeviceData
from app.internal.senderPoll.sender import sender_service

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()
	loadServiceData.disconnect()
	loadDeviceData.disconnect()

	sender_service.disconnect()

	logger.info("stop")
