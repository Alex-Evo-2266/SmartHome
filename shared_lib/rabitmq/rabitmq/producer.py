import pika
import json
import logging

# ===========================
# Базовый класс Producer
# ===========================
class BaseRabbitMQProducer:
    def __init__(self, host='localhost', port=5672, logger=None):
        self.host = host
        self.port = port
        self.connection = None
        self.channel = None
        self.logger = logger or logging.getLogger(__name__)

    def connect(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=self.host, port=self.port, heartbeat=600)
        )
        self.channel = self.connection.channel()
        self.logger.info(f"Connected to RabbitMQ {self.host}:{self.port}")

    def publish(self, message):
        raise NotImplementedError

    def close(self):
        if self.connection and self.connection.is_open:
            self.connection.close()
            self.logger.info("RabbitMQ connection closed")


class RabbitMQProducer(BaseRabbitMQProducer):
    def __init__(self, host='localhost', port=5672, queue_name='default_queue', logger=None):
        super().__init__(host, port, logger)
        self.queue_name = queue_name

    def connect(self):
        super().connect()
        self.channel.queue_declare(queue=self.queue_name, durable=False)
        self.logger.info(f"Queue '{self.queue_name}' declared")

    def publish(self, message):
        if not self.connection or self.connection.is_closed:
            self.connect()
        self.channel.basic_publish(
            exchange='',
            routing_key=self.queue_name,
            body=json.dumps(message),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        self.logger.debug(f"Published message to queue '{self.queue_name}': {message}")


class RabbitMQProducerFanout(BaseRabbitMQProducer):
    def __init__(self, host='localhost', port=5672, exchange_name='broadcast', logger=None):
        super().__init__(host, port, logger)
        self.exchange_name = exchange_name

    def connect(self):
        super().connect()
        self.channel.exchange_declare(exchange=self.exchange_name, exchange_type='fanout')
        self.logger.info(f"Fanout exchange '{self.exchange_name}' declared")

    def publish(self, message):
        if not self.connection or self.connection.is_closed:
            self.connect()
        self.channel.basic_publish(
            exchange=self.exchange_name,
            routing_key='',
            body=json.dumps(message),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        self.logger.debug(f"Published message to fanout '{self.exchange_name}': {message}")

