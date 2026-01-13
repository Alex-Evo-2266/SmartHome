
from app.pkg import FanoutConsumer, QueueConsumer
from app.configuration.settings import RABITMQ_HOST, RABITMQ_PORT, EXCHANGE_ROOM_DATA, EXCHANGE_DEVICE_DATA, DATA_SCRIPT
from .device import device_listener
from .room import setRoom
from .script import run_script
from app.internal.logs import MyLogger

logger = MyLogger().get_logger(__name__)

# слушатели
loadRoomData = FanoutConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, exchange=EXCHANGE_ROOM_DATA, callback=setRoom, logger=logger)
loadDeviceData = FanoutConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, exchange=EXCHANGE_DEVICE_DATA, callback=device_listener, logger=logger)
loadScriptData = QueueConsumer(host=RABITMQ_HOST, port=RABITMQ_PORT, queue=DATA_SCRIPT, callback=run_script, logger=logger)