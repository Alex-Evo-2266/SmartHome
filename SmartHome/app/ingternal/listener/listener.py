

from app.pkg import QueueConsumer
from app.configuration.settings import RABITMQ_HOST, RABITMQ_PORT, DATA_LISTEN_QUEUE, DEVICE_VALUE_SEND
from .device.device_listener import device_listener
from .service.setData import setDataService
import logging

logger = logging.getLogger(__name__)

# слушатели
loadServiceData = QueueConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, queue=DATA_LISTEN_QUEUE, callback=setDataService, logger=logger)
loadDeviceData = QueueConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, queue=DEVICE_VALUE_SEND, callback=device_listener, logger=logger)