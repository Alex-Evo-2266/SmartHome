import logging, asyncio
from app.pkg import itemConfig, ConfigItemType, __config__

from app.moduls import getModule

logger = logging.getLogger(__name__)

async def startup():
	
	logger.info("generete config")

	await __config__.load()

	getModule()
	
	logger.info("starting")
