from app.pkg.deps.rabitmq import FanoutSender
from app.pkg.logger import MyLogger
from app.core.state.get_store import get_container

logger = MyLogger().get_logger(__name__)

async def room_data_provider():
    snapshots = get_container().room_store.get_all_snapshots()
    return {room.room: room.model_dump() for room in snapshots}

sender_room = FanoutSender(
    logger=logger,
    data_provider=room_data_provider
)