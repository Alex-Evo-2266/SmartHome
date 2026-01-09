from app.pkg import FanoutSender, QueueSender
from app.configuration.settings import SERVICE_DATA_POLL
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.modules.struct.DeviceStatusStore import store
from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.logs import MyLogger

logger = MyLogger().get_logger(__name__)

async def device_data_provider():
    snapshots = store.get_all_snapshots()
    devices = [DeviceSchema(**x.description.model_dump(), value=x.state) for x in snapshots]
    return {device.system_name: device.model_dump() for device in devices}

async def service_data_provider(data_poll:ObservableDict):
    service_pull:ObservableDict = data_poll.get(SERVICE_DATA_POLL)
    return service_pull.get_all()

async def room_data_provider():
    from app.ingternal.room.cache.all_rooms import get_cached_room_type_device_data
    return await get_cached_room_type_device_data()

sender_device = FanoutSender(
    logger=logger,
    data_provider=lambda: device_data_provider()
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
