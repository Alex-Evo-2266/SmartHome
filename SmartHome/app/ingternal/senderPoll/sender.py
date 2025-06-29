from app.pkg.rabitmq import RabbitMQProducer, RabbitMQProducerFanout
from app.configuration.settings import RABITMQ_HOST, DEVICE_DATA_POLL, SERVICE_DATA_POLL, DATA_DEVICE_QUEUE, DATA_QUEUE, EXCHANGE_DEVICE_DATA
from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.logs import get_sender_logger

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

class SenderDevice(SenderMore):
    async def send(self, *args, **keys):
        data = self.data.get_all()
        data = {key: value.model_dump() for key, value in data.items()}
        logger.info(f"send device")
        self.publisher.publish(data)

sender_device = SenderDevice()
sender_service = Sender()

def init_sender():
    data_poll: ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
    sender_device.connect(EXCHANGE_DEVICE_DATA, data_poll)
    data_poll.subscribe_all("sender", sender_device.send)
    service_data_poll: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
    sender_service.connect(DATA_QUEUE, service_data_poll)
    service_data_poll.subscribe_all("sender", sender_service.send)