from app.pkg import FanoutConsumer
from app.internal.poll.setData import setDataService, setDataDevice
from app.configuration.settings import RABITMQ_HOST, RABITMQ_PORT, EXCHANGE_SERVICE_DATA, EXCHANGE_DEVICE_DATA
import logging

logger = logging.getLogger(__name__)

print("p999",RABITMQ_HOST, RABITMQ_PORT, EXCHANGE_SERVICE_DATA, EXCHANGE_DEVICE_DATA )

# слушатели
loadServiceData = FanoutConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, exchange=EXCHANGE_SERVICE_DATA, callback=setDataService, logger=logger)
loadDeviceData = FanoutConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, exchange=EXCHANGE_DEVICE_DATA, callback=setDataDevice, logger=logger)