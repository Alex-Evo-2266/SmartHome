import logging, time
from app.configuration.initialization.role import initRole
from app.configuration.initialization.user import initUser
from app.pkg.email import send_email, EmailSendSchema, email_connect

from app.pkg.ormar.dbormar import database

logger = logging.getLogger(__name__)

async def startup():
	
	database_ = database
	if not database_.is_connected:
		await database_.connect()

	await initRole()
	await initUser()

	email_connect()

	# time.sleep(0.1)
	# send_email(EmailSendSchema(
	# 	to_email='ghbdtn2244@mail.ru',
	# 	title="Account smart home",
	# 	message="sdfh tdht rhrdx hxdh dh srd xdh"
	# ))


	logger.info("starting")
