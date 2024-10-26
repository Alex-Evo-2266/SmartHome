import logging
from app.pkg import __config__

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()

	logger.info("stop")
