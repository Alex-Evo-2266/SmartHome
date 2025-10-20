import logging
from fastapi import FastAPI
from app.pkg.ormar.dbormar import database
from app.pkg.email import email_desconnect

logger = logging.getLogger(__name__)

async def shutdown():
	database_ = database
	if database_.is_connected:
		await database_.disconnect()

	email_desconnect()
