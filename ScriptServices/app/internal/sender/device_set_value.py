from app.pkg.rabitmq import RabbitMQProducer
from app.configuration.settings import RABITMQ_HOST

class SenderDevice:
    def __init__(self, ):
        self.publisher = None
        
    def connect(self, qoeue: str):
        self.qoeue = qoeue
        self.publisher = RabbitMQProducer(host=RABITMQ_HOST, queue_name=self.qoeue)
        self.publisher.connect()

    async def send(self, data, *args, **keys):
        print("send")
        self.publisher.publish({"type": "set_value", "data": data})

    def disconnect(self):
        self.publisher.close()

sender_device = SenderDevice()

