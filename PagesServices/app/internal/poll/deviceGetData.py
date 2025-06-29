from app.pkg.rabitmq import WorkerThread, FanoutConsumer
from app.configuration.settings import RABITMQ_HOST, RABITMQ_PORT, EXCHANGE_DEVICE_DATA


class LoadData:
    def __init__(self):
        self.worker = WorkerThread()
        
    def connect(self, queue: str, callback):
        print(RABITMQ_HOST, queue, RABITMQ_PORT)
        self.queue = queue
        self.worker.set_connection_data(RABITMQ_HOST, queue=queue, port=RABITMQ_PORT, callback=callback)
        self.worker.start()

    def disconnect(self):
        self.worker.stop()

class LoadDataFanout:
    def __init__(self):
        self.worker = FanoutConsumer()
        
    def connect(self, exchange: str, callback):
        print(RABITMQ_HOST, exchange, RABITMQ_PORT)
        self.exchange = exchange
        self.worker.set_connection_data(host=RABITMQ_HOST, exchange=exchange, port=RABITMQ_PORT, callback=callback)
        self.worker.start()

    def disconnect(self):
        self.worker.stop()


loadDeviceData = LoadDataFanout()
loadServiceData = LoadData()