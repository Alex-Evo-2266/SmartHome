import logging, asyncio
from app.pkg import itemConfig, ConfigItemType, __config__
from app.pkg.rabitmq import worker
from app.configuration.settings import RABITMQ_HOST, EMAIL_QUEUE
from app.internal.email.logic.email import send_email_callback

logger = logging.getLogger(__name__)

# def onMessage(ch, method, properties, body):
# 	print(body)
# 	print(ch, method, properties, body)
# 	send_email_callback()

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
	
	worker.set_connection_data(RABITMQ_HOST, EMAIL_QUEUE, send_email_callback, True)
	logger.info("generete config")

	await __config__.load()
	  
	worker.start()

	logger.info("starting")

	  
