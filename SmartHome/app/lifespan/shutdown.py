import logging

from app.pkg.config.core import __config__
from app.pkg.runtime.loop import loop
from app.lifespan.start_senders import stop_rabbitmq_senders
from app.lifespan.listener import loadServiceData, loadDeviceData

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()
	loop.stop()
	stop_rabbitmq_senders()
	loadServiceData.stop()
	loadDeviceData.stop()

	logger.info("stop")
