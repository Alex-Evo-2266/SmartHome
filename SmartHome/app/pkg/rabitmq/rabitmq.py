import pika, json
from threading import Thread
from app.ingternal.logs.logs import LogManager, MyLogger
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
		self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host))
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
	
class Publisher:
    def __init__(self):
        self.connection = None
        self.channel = None
        self._is_closed = False
        self.queue = None
        self.port = None

    def connect(self, host: str, queue: str, port=15600):
        """
        Подключение к RabbitMQ.
        :param host: Хост RabbitMQ
        :param queue: Имя очереди
        :param port: Порт (по умолчанию 15600)
        """
        self.queue = queue
        self.port = port
        try:
            # Параметры подключения с heartbeat и таймаутами
            logger.info(f"начало подключения к RabbitMQ (очередь: {self.queue}).")
            parameters = pika.ConnectionParameters(
                host=host,
                # port=port,
                heartbeat=600,  # 10 минут
                blocked_connection_timeout=300  # 5 минут
            )
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue=self.queue, durable=True)  # durable=True для сохранения очереди после перезапуска
            logger.info(f"Успешное подключение к RabbitMQ (очередь: {self.queue}).")
        except Exception as e:
            logger.error(f"Ошибка подключения к RabbitMQ: {e}")
            raise

    def publish(self, message):
        """
        Публикация сообщения в очередь.
        :param message: Сообщение для публикации (будет преобразовано в JSON)
        """
        if not self.connection or not self.channel or self._is_closed:
            logger.error("Соединение с RabbitMQ не установлено или закрыто.")
            raise RuntimeError("Соединение с RabbitMQ не установлено или закрыто.")

        try:
            self.channel.basic_publish(
                exchange='',
                routing_key=self.queue,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Сообщение будет сохранено на диск (persistent)
                )
            )
            logger.info(f"Сообщение опубликовано в очередь {self.queue}: {message}")
        except Exception as e:
            logger.error(f"Ошибка при публикации сообщения: {e}")
            raise

    def stop(self):
        """
        Закрытие соединения с RabbitMQ.
        """
        if self.connection and not self._is_closed:
            try:
                if self.channel:
                    self.channel.close()
                self.connection.close()
                self._is_closed = True
                logger.info("Соединение с RabbitMQ успешно закрыто.")
            except Exception as e:
                logger.error(f"Ошибка при закрытии соединения с RabbitMQ: {e}")
                raise
        else:
            logger.warning("Соединение с RabbitMQ уже закрыто или не было установлено.")

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
        # logger.debug(f" [x] Sent {message}")

    def close(self):
        """Закрывает соединение с RabbitMQ."""
        if self.connection and self.connection.is_open:
            self.connection.close()
            logger.info("Connection closed")

# class RabbitMQProducer:
#     def __init__(self, host='rabbitmq', port=5672, queue_name='default_queue'):
#         self.host = host
#         self.port = port
#         self.queue_name = queue_name
#         self.connection = None
#         self.channel = None

#     def connect(self):
#         """Устанавливает соединение с RabbitMQ сервером."""
#         while True:
#             try:
#                 self.connection = pika.BlockingConnection(
#                     pika.ConnectionParameters(
#                         host=self.host,
#                         port=self.port,
#                         heartbeat=600  # Увеличиваем heartbeat
#                     )
#                 )
#                 self.channel = self.connection.channel()
#                 self.channel.queue_declare(queue=self.queue_name, durable=False)
#                 print("Connected to RabbitMQ")
#                 break
#             except pika.exceptions.AMQPConnectionError as e:
#                 print(f"Connection failed: {e}. Retrying in 5 seconds...")
#                 time.sleep(5)

#     def publish(self, message):
#         """Отправляет сообщение в очередь."""
#         if not self.connection or self.connection.is_closed:
#             self.connect()

#         try:
#             self.channel.basic_publish(
#                 exchange='',
#                 routing_key=self.queue_name,
#                 body=message,
#                 properties=pika.BasicProperties(
#                     delivery_mode=2,  # Сообщение будет persistent
#                 )
#             )
#             print(f" [x] Sent {message}")
#         except pika.exceptions.StreamLostError:
#             print("Stream lost. Reconnecting...")
#             self.connect()
#             self.publish(message)  # Повторная отправка сообщения

#     def close(self):
#         """Закрывает соединение с RabbitMQ."""
#         if self.connection and self.connection.is_open:
#             self.connection.close()
#             print("Connection closed")