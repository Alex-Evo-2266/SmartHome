import pika
import json
import logging
from threading import Thread

# ===========================
# Базовый класс Consumer
# ===========================
class BaseRabbitMQConsumer(Thread):
    def __init__(self, host='localhost', port=5672, callback=None, auto_ack=True, logger=None):
        super().__init__()
        self.host = host
        self.port = port
        self.callback = callback
        self.auto_ack = auto_ack
        self.connection = None
        self.channel = None
        self._is_interrupted = False
        self.logger = logger or logging.getLogger(__name__)

    def stop(self):
        self._is_interrupted = True
        if self.connection and self.connection.is_open:
            self.connection.close()
        self.logger.info("Consumer stopped")

    def run(self):
        raise NotImplementedError


class QueueConsumer(BaseRabbitMQConsumer):
    def __init__(self, host='localhost', port=5672, queue='default_queue', callback=None, auto_ack=True, logger=None):
        super().__init__(host, port, callback, auto_ack, logger)
        self.queue = queue

    def run(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, port=self.port))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue)

        self.logger.info(f"Consuming queue '{self.queue}' on {self.host}:{self.port}")
        for message in self.channel.consume(self.queue, inactivity_timeout=1, auto_ack=self.auto_ack):
            if self._is_interrupted:
                break
            if not all(message):
                continue
            method, properties, body = message
            data = json.loads(body)
            if self.callback:
                self.callback(method, properties, data)
            self.logger.debug(f"Consumed message from '{self.queue}': {data}")


class FanoutConsumer(BaseRabbitMQConsumer):
    def __init__(self, host='localhost', port=5672, exchange='broadcast', callback=None, auto_ack=True, logger=None):
        super().__init__(host, port, callback, auto_ack, logger)
        self.exchange = exchange

    def run(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, port=self.port))
        self.channel = self.connection.channel()
        self.channel.exchange_declare(exchange=self.exchange, exchange_type='fanout')

        result = self.channel.queue_declare(queue='', exclusive=True)
        queue_name = result.method.queue
        self.channel.queue_bind(exchange=self.exchange, queue=queue_name)

        self.logger.info(f"Consuming fanout exchange '{self.exchange}' on {self.host}:{self.port}")

        def on_message(ch, method, properties, body):
            if self._is_interrupted:
                ch.stop_consuming()
            data = json.loads(body)
            if self.callback:
                self.callback(data)
            self.logger.debug(f"Consumed message from fanout '{self.exchange}': {data}")

        self.channel.basic_consume(queue=queue_name, on_message_callback=on_message, auto_ack=True)
        try:
            self.channel.start_consuming()
        except Exception as e:
            self.logger.error(f"Consumer error: {e}")