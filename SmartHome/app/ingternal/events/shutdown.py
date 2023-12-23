import logging
from fastapi import FastAPI
from app.pkg.ormar.dbormar import database

logger = logging.getLogger(__name__)

async def shutdown():
	database_ = database
	if database_.is_connected:
		await database_.disconnect()