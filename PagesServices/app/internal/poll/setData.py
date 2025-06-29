from app.internal.poll.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import SERVICE_DATA_POLL, DEVICE_DATA_POLL

from app.internal.logs import get_listener_logger

logger = get_listener_logger.get_logger(__name__)

def setDataService(method, properties, body):
    logger.info(f"load service data")
    services_data:ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
    services_data._data = body


def setDataDevice(method, properties, body):
    logger.info(f"load deviece data")
    services_data:ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
    services_data._data = body