import logging, asyncio
from app.pkg import itemConfig, ConfigItemType, __config__
from app.internal.poll.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import DEVICE_DATA_POLL, SERVICE_DATA_POLL, DATA_DEVICE_QUEUE, DATA_QUEUE
from app.internal.poll.schemas.device import DeviceSchema
from typing import Dict, List
from app.internal.poll.deviceGetData import loadServiceData, loadDeviceData
from app.internal.poll.setData import setDataService, setDataDevice

from app.internal.senderPoll.sender import init_sender

from app.moduls import getModule

logger = logging.getLogger(__name__)

async def startup():
	
	logger.info("generete config")

	await __config__.load()

	servicesDataPoll.set(DEVICE_DATA_POLL, ObservableDict[DeviceSchema]())
	servicesDataPoll.set(SERVICE_DATA_POLL, ObservableDict[Dict | str | List]())

	getModule()

	loadServiceData.connect(DATA_QUEUE, setDataService)
	loadDeviceData.connect(DATA_DEVICE_QUEUE, setDataDevice)

	init_sender()
	
	logger.info("starting")