import logging
# from app.ingternal.authtorization.initialization.init_admin import init_admin
# from app.configuration.config import __module_config__

from app.pkg.ormar.dbormar import database

logger = logging.getLogger(__name__)

async def startup():
	
	database_ = database
	if not database_.is_connected:
		await database_.connect()

	# await init_admin()

	logger.info("starting")
