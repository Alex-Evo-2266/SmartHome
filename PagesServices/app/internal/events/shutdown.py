import logging
from app.pkg import __config__
from app.internal.poll.deviceGetData import loadServiceData, loadDeviceData

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()
	loadServiceData.disconnect()
	loadDeviceData.disconnect()

	logger.info("stop")
