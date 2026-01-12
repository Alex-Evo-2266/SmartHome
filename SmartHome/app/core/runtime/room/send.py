from app.pkg.websoket.manager import WebSocketMenager
from app.pkg.logger import MyLogger
from app.core.state.get_store import get_container
from app.bootstrap.const import TYPE_SEND_ROOT, TYPE_SEND_PATCH_ROOT

logger = MyLogger().get_logger(__name__)

async def send_room_patch_data(patchs):
    try:
        await WebSocketMenager.send_information(TYPE_SEND_PATCH_ROOT, patchs.model_dump())
        logger.info("Device data successfully sent.")
    except Exception as e:
        logger.error(f"Error sending device data: {str(e)}")

async def send_room_snapshots_data(snapshots):
    try:
        arr = [x.model_dump() for x in snapshots]
        await WebSocketMenager.send_information(TYPE_SEND_ROOT, arr)
        logger.info("Device data successfully sent.")
    except Exception as e:
        logger.error(f"Error sending device data: {str(e)}")

# Перезапуск отправки данных о устройствах
async def restart_send_room_data():
    
    logger.info('Attempting to restart sending room data...')
    room_store = get_container().room_store
    await room_store.subscribe_snapshot_global_async("send_room", send_room_snapshots_data)
    room_store.subscribe_patch_global("send_room_patch", send_room_patch_data)
    