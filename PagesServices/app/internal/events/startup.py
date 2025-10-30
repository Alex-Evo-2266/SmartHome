import logging, os
from app.pkg import __config__
from app.internal.poll.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import DEVICE_DATA_POLL, SERVICE_DATA_POLL, DATA_QUEUE, EXCHANGE_DEVICE_DATA, DASHBOARD_FOLDER
from app.internal.poll.schemas.device import DeviceSchema
from typing import Dict, List
from app.internal.listener.listener import loadServiceData, loadDeviceData

from app.internal.senderPoll.sender import init_sender

from app.moduls import getModule
from app.pkg.ormar.dbormar import database

logger = logging.getLogger(__name__)

def ensure_directory_exists(directory):
    """Проверяет, существует ли директория, и если нет — создает её."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Директория {directory} создана.")
    else:
        print(f"Директория {directory} уже существует.")

def create_directorys():
    ensure_directory_exists(DASHBOARD_FOLDER)
    print(DASHBOARD_FOLDER)

async def startup():
     
	database_ = database
	if not database_.is_connected:
		await database_.connect()
	
	logger.info("generete config")

	await __config__.load()

	servicesDataPoll.set(DEVICE_DATA_POLL, ObservableDict[DeviceSchema]())
	servicesDataPoll.set(SERVICE_DATA_POLL, ObservableDict[Dict | str | List]())

	getModule()

	loadServiceData.start()
	loadDeviceData.start()

	init_sender()

	create_directorys()
	
	logger.info("starting")