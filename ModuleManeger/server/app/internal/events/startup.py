import logging, time
from app.internal.module.restart import restart_all_active_modules
from app.configuration.settings import GIT_HUB_KEY
from app.pkg import itemConfig, ConfigItemType, __config__

logger = logging.getLogger(__name__)

async def startup():

	logger.info("run")
	# Регистрация конфигурационных параметров
	try:
		__config__.register_config(
			itemConfig(tag="modulr manager", key=GIT_HUB_KEY, type=ConfigItemType.TEXT)
		)
		logger.info("Configuration items registered.")
	except Exception as e:
		logger.error(f"Error registering configuration items: {e}")

	restart_all_active_modules()

	# Загрузка конфигурации
	try:
		await __config__.load()
		logger.info("Configuration loaded successfully.")
	except Exception as e:
		logger.error(f"Failed to load configuration: {e}")
		return

	logger.info("starting")
