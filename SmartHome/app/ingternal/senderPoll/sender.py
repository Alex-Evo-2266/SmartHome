from app.pkg.rabitmq import Publisher
from app.configuration.settings import RABITMQ_HOST, RABITMQ_PORT
from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict

class Sender:
    def __init__(self):
        self.publisher = Publisher()
        

    def connect(self, qoeue: str, dataPoll: ObservableDict):
        self.qoeue = qoeue
        self.data = dataPoll
        self.publisher.connect(RABITMQ_HOST, self.qoeue, port=RABITMQ_PORT)

    async def send(self, *args, **keys):
        print("send")
        self.publisher.publish(self.data.get_all())

    def disconnect(self):
        self.publisher.stop()

class SenderDevice(Sender):
    async def send(self, *args, **keys):
        print("sende")
        data = self.data.get_all()
        data = {key: value.model_dump() for key, value in data.items()}
        self.publisher.publish(data)

sender_device = SenderDevice()
sender_service = Sender()