from app.pkg.rabitmq import RabbitMQProducer
from app.configuration.settings import RABITMQ_HOST, DEVICE_DATA_POLL, SERVICE_DATA_POLL, DATA_LISTEN_QUEUE

class SenderCommand:
    def __init__(self, ):
        self.publisher = None
        
    def connect(self, qoeue: str):
        self.qoeue = qoeue
        self.publisher = RabbitMQProducer(host=RABITMQ_HOST, queue_name=self.qoeue)
        self.publisher.connect()

    async def send(self,service_name:str, data:str | dict = "", *args, **keys):
        print("send")
        self.publisher.publish({service_name: data})

    def disconnect(self):
        self.publisher.close()

sender_service = SenderCommand()

def init_sender():
    sender_service.connect(DATA_LISTEN_QUEUE)