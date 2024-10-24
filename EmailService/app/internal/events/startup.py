import logging
from app.pkg import itemConfig, ConfigItemType, __config__

logger = logging.getLogger(__name__)

async def startup():

	__config__.register_config(itemConfig(
		tag="email",
		key="email"
	))

	__config__.register_config(itemConfig(
		tag="email",
		key="password",
		type=ConfigItemType.PASSWORD
	))

	await __config__.load()
	 
	logger.info("generete config")
	logger.info("starting")

