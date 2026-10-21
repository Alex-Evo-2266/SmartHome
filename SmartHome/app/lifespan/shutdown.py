from app.db.ormar.dbormar import database
from app.pkg.logger import MyLogger
from app.pkg.config.core import __config__
from app.pkg.runtime.loop import loop
from app.lifespan.start_senders import stop_rabbitmq_senders
from app.lifespan.listener import loadServiceData, loadDeviceData
from app.scheduler import scheduler

async def shutdown():
	logger = MyLogger().get_logger(__name__)

	try:
		if scheduler.running:
			logger.info("Stopping APScheduler...")
			scheduler.shutdown()
			logger.info("APScheduler stopped.")
	finally:
		try:
			__config__.save()
			loop.stop()
			stop_rabbitmq_senders()
			loadServiceData.stop()
			loadDeviceData.stop()

			logger.info("Application services stopped.")
		finally:
			if database.is_connected:
				logger.info("Disconnecting from the database...")
				try:
					await database.disconnect()
				except Exception:
					logger.exception("Failed to disconnect from the database.")
					raise
				logger.info("Database connection closed.")
