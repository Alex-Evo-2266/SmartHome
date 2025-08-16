from app.pkg import FanoutSender, QueueSender
from app.configuration.settings import DEVICE_DATA_POLL, SERVICE_DATA_POLL
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.logs import get_sender_logger

logger = get_sender_logger.get_logger(__name__)

async def device_data_provider(data_poll:ObservableDict):
    device_pull:ObservableDict = data_poll.get(DEVICE_DATA_POLL)
    data = device_pull.get_all()
    return {k: v.model_dump() for k, v in data.items()}

async def service_data_provider(data_poll:ObservableDict):
    service_pull:ObservableDict = data_poll.get(SERVICE_DATA_POLL)
    return service_pull.get_all()

async def room_data_provider():
    from app.ingternal.room.cache.all_rooms import get_cached_room_type_device_data
    return await get_cached_room_type_device_data()

sender_device = FanoutSender(
    logger=logger,
    data_provider=lambda: device_data_provider(servicesDataPoll)
)

sender_service = FanoutSender(
    logger=logger,
    data_provider=lambda: service_data_provider(servicesDataPoll)
)

sender_room = FanoutSender(
    logger=logger,
    data_provider=room_data_provider
)

sender_script = QueueSender(
    logger=logger,
    data_provider=None  # данные передаются напрямую при send()
)
