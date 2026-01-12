

from app.pkg.deps.rabitmq import QueueConsumer
from app.bootstrap.settings import RABITMQ_HOST, RABITMQ_PORT, DATA_LISTEN_QUEUE, DEVICE_VALUE_SEND
from app.core.runtime.device.listener import device_listener
from app.core.runtime.module.listener import setDataService
import logging

logger = logging.getLogger(__name__)

# слушатели
loadServiceData = QueueConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, queue=DATA_LISTEN_QUEUE, callback=setDataService, logger=logger)
loadDeviceData = QueueConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, queue=DEVICE_VALUE_SEND, callback=device_listener, logger=logger)

def start_listeners():
    loadServiceData.start()
    loadDeviceData.start()