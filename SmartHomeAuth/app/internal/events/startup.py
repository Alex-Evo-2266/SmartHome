import logging
from app.configuration.initialization.role import initRole
from app.configuration.initialization.user import initUser

from app.pkg.ormar.dbormar import database

logger = logging.getLogger(__name__)

async def startup():
	
	database_ = database
	if not database_.is_connected:
		await database_.connect()

	await initRole()
	await initUser()

	logger.info("starting")
