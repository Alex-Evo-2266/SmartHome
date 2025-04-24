import pika, json
from threading import Thread
from app.internal.logs.logs import LogManager, MyLogger
from app.configuration.settings import LOGS_LEVEL

rabbitHandler = LogManager("rabbitLog", LOGS_LEVEL)
logger_obg = MyLogger(rabbitHandler)
logger = logger_obg.get_logger(__name__)

class WorkerThread(Thread):
	def __init__(self):
		super(WorkerThread, self).__init__()
		self.queues_message: dict[str, callable] = {}
		self.queues: list[str] = []
		self._is_interrupted = False
		
	def set_connection_data(self, host:str, queue:str, callback:callable, auto_ack=True, port=15600):
		self.host = host
		self.auto_ack = auto_ack
		self.queue = queue
		self.callback = callback
		self.port = port

	def stop(self):
		self._is_interrupted = True

	def run(self):
		self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, heartbeat=120))
		self.channel = self.connection.channel()
		self.channel.queue_declare(queue=self.queue)
		for message in self.channel.consume(self.queue, inactivity_timeout=1, auto_ack=self.auto_ack):
			if self._is_interrupted:
				break
			if not all(message):
				continue
			method, properties, body = message
			body = json.loads(body)
			self.callback(method, properties, body)
	
class RabbitMQProducer:
    def __init__(self, host='localhost', port=5672, queue_name='default_queue'):
        self.host = host
        self.port = port
        self.queue_name = queue_name
        self.connection = None
        self.channel = None

    def connect(self):
        """Устанавливает соединение с RabbitMQ сервером."""
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=self.host, port=self.port, heartbeat=600)
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue_name, durable=False)

    def publish(self, message):
        """Отправляет сообщение в очередь."""
        if not self.connection or self.connection.is_closed:
            self.connect()

        self.channel.basic_publish(
            exchange='',
            routing_key=self.queue_name,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # делает сообщение постоянным
            )
        )
        logger.debug(f" [x] Sent {message}")

    def close(self):
        """Закрывает соединение с RabbitMQ."""
        if self.connection and self.connection.is_open:
            self.connection.close()
            logger.info("Connection closed")
