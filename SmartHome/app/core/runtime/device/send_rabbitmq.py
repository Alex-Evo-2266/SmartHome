from app.pkg.deps.rabitmq import FanoutSender
from app.core.state.get_store import get_container
from app.schemas.device.device import DeviceSchema
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

async def device_data_provider():
    snapshots = get_container().device_store.get_all_snapshots()
    devices = [DeviceSchema(**x.description.model_dump(), value=x.state) for x in snapshots]
    return {device.system_name: device.model_dump() for device in devices}


sender_device = FanoutSender(
    logger=logger,
    data_provider=lambda: device_data_provider()
)