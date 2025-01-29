import logging

from app.pkg import __config__
from app.configuration.loop.loop import loop

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()
	loop.stop()

	logger.info("stop")
