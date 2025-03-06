# from app.pkg.rabitmq import Publisher
# from app.configuration.settings import RABITMQ_HOST, RABITMQ_PORT
# from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict

# class Sender:
#     def __init__(self):
#         self.publisher = Publisher()
        

#     def connect(self, qoeue: str, dataPoll: ObservableDict):
#         self.qoeue = qoeue
#         self.data = dataPoll
#         self.publisher.connect(RABITMQ_HOST, self.qoeue, port=RABITMQ_PORT)

#     async def send(self, *args, **keys):
#         print("send")
#         self.publisher.publish(self.data.get_all())

#     def disconnect(self):
#         self.publisher.stop()

# class SenderDevice(Sender):
#     async def send(self, *args, **keys):
#         print("sende")
#         data = self.data.get_all()
#         data = {key: value.model_dump() for key, value in data.items()}
#         self.publisher.publish(data)

# sender_device = SenderDevice()
# sender_service = Sender()

from app.pkg.rabitmq import RabbitMQProducer
from app.configuration.settings import RABITMQ_HOST, DEVICE_DATA_POLL, SERVICE_DATA_POLL, DATA_DEVICE_QUEUE, DATA_QUEUE
from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll

class Sender:
    def __init__(self, ):
        self.publisher = None
        
    def connect(self, qoeue: str, dataPoll: ObservableDict):
        self.qoeue = qoeue
        self.data = dataPoll
        self.publisher = RabbitMQProducer(host=RABITMQ_HOST, queue_name=self.qoeue)
        self.publisher.connect()

    async def send(self, *args, **keys):
        print("send")
        self.publisher.publish(self.data.get_all())

    def disconnect(self):
        self.publisher.close()

class SenderDevice(Sender):
    async def send(self, *args, **keys):
        print("sende")
        data = self.data.get_all()
        data = {key: value.model_dump() for key, value in data.items()}
        self.publisher.publish(data)

sender_device = SenderDevice()
sender_service = Sender()

def init_sender():
    data_poll: ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
    sender_device.connect(DATA_DEVICE_QUEUE, data_poll)
    data_poll.subscribe_all("sender", sender_device.send)
    service_data_poll: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
    sender_service.connect(DATA_QUEUE, service_data_poll)
    service_data_poll.subscribe_all("sender", sender_service.send)