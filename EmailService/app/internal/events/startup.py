import logging
from app.pkg.config import itemConfig, ConfigItemType
from app.configuration.settings import __config__

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

