import logging
from app.pkg import __config__
from app.pkg.rabitmq import worker

logger = logging.getLogger(__name__)

async def shutdown():

	__config__.save()

	worker.stop()
	worker.join()
	logger.info("stop")
