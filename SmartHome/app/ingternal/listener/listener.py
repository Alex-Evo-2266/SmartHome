from app.pkg.rabitmq import WorkerThread
from app.configuration.settings import RABITMQ_HOST, RABITMQ_PORT

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