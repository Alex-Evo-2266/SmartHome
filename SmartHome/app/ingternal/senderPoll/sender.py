from app.pkg.rabitmq import RabbitMQProducer, RabbitMQProducerFanout
from app.configuration.settings import RABITMQ_HOST, DEVICE_DATA_POLL, SERVICE_DATA_POLL, DATA_SCRIPT, DATA_DEVICE_QUEUE, DATA_QUEUE, EXCHANGE_DEVICE_DATA, EXCHANGE_ROOM_DATA
from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.logs import get_sender_logger
from app.ingternal.room.cache.all_rooms import get_cached_room_type_device_data

logger = get_sender_logger.get_logger(__name__)

class Sender:
    def __init__(self, ):
        self.publisher = None
        
    def connect(self, qoeue: str, dataPoll: ObservableDict):
        self.qoeue = qoeue
        self.data = dataPoll
        self.publisher = RabbitMQProducer(host=RABITMQ_HOST, queue_name=self.qoeue)
        self.publisher.connect()

    async def send(self, *args, **keys):
        logger.info(f"send")
        self.publisher.publish(self.data.get_all())

    def disconnect(self):
        self.publisher.close()

class SenderMore:
    def __init__(self, ):
        self.publisher = None
        
    def connect(self, exchange: str, dataPoll: ObservableDict):
        self.exchange = exchange
        self.data = dataPoll
        self.publisher = RabbitMQProducerFanout(host=RABITMQ_HOST, exchange_name=self.exchange)
        self.publisher.connect()

    async def send(self, *args, **keys):
        logger.info(f"send more")
        self.publisher.publish(self.data.get_all())

    def disconnect(self):
        self.publisher.close()

class SenderRoom(SenderMore):
    def __init__(self, ):
        self.publisher = None
        
    def connect(self, exchange: str):
        self.exchange = exchange
        self.publisher = RabbitMQProducerFanout(host=RABITMQ_HOST, exchange_name=self.exchange)
        self.publisher.connect()

    async def send(self, *args, **keys):
        logger.info(f"send room")
        data = await get_cached_room_type_device_data()
        # safe_data = [item.dict() for item in data]
        self.publisher.publish(data)

    def disconnect(self):
        self.publisher.close()

class SenderScript:
    def __init__(self, ):
        self.publisher = None
        
    def connect(self, queue_name: str):
        self.queue_name = queue_name
        self.publisher = RabbitMQProducer(host=RABITMQ_HOST, queue_name=queue_name)
        self.publisher.connect()

    async def send(self, data, *args, **keys):
        logger.info(f"send script")
        try:
            self.publisher.publish(data)
        except Exception as e:
            print(e)

    def disconnect(self):
        self.publisher.close()

class SenderDevice(SenderMore):
    async def send(self, *args, **keys):
        data = self.data.get_all()
        data = {key: value.model_dump() for key, value in data.items()}
        try:
            print("p700", data["lamp1"])
        except Exception as e:
            print("p600", e)
        logger.info(f"send device")
        self.publisher.publish(data)

sender_device = SenderDevice()
sender_room = SenderRoom()
sender_service = Sender()
sender_script = SenderScript()

async def send_data():
    logger.info(f"ex {EXCHANGE_ROOM_DATA}")
    await sender_device.send()
    await sender_room.send()

def init_sender():
    data_poll: ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
    sender_device.connect(EXCHANGE_DEVICE_DATA, data_poll)
    sender_room.connect(EXCHANGE_ROOM_DATA)
    data_poll.subscribe_all("sender", send_data)
    sender_script.connect(DATA_SCRIPT)
    # data_poll.subscribe_all("sender2", sender_room.send)
    service_data_poll: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
    sender_service.connect(DATA_QUEUE, service_data_poll)
    service_data_poll.subscribe_all("sender", sender_service.send)