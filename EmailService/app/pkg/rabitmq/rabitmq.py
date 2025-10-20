import pika, json
from threading import Thread

# class WorkerThread(Thread):

# 	def __init__(self):
# 		super(WorkerThread, self).__init__()
# 		self.queues_message: dict[str, callable] = {}
# 		self.queues: list[str] = []
# 		self.thread = None
# 		self._is_interrupted = False
		
# 	def register_queue(self, queue:str, onMessage: callable = None):
# 		self.queues.append(queue)
# 		if onMessage:
# 			self.queues_message[queue] = onMessage

# 	def set_connection_data(self, host:str, auto_ack=False):
# 		self.host = host
# 		self.auto_ack = auto_ack

# 	def publish(self, queues, message):
# 		self.channel.basic_publish(exchange='', routing_key=queues, body=json.dumps(message))

# 	def stop(self):
# 		self._is_interrupted = True

# 	def run(self):
# 		self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host))
# 		self.channel = self.connection.channel()
# 		for queue in self.queues:
# 			self.channel.queue_declare(queue=queue)
# 		for message in self.channel.consume(queue, inactivity_timeout=1, auto_ack=self.auto_ack):
# 			if self._is_interrupted:
# 				break
# 			if not all(message):
# 				continue
# 			method, properties, body = message
# 			body = json.loads(body)
# 			self.queues_message[queue](method, properties, body)
		

class WorkerThread(Thread):
	def __init__(self):
		super(WorkerThread, self).__init__()
		self.queues_message: dict[str, callable] = {}
		self.queues: list[str] = []
		self._is_interrupted = False
		
	def set_connection_data(self, host:str, queue:str, callback:callable, auto_ack=True):
		self.host = host
		self.auto_ack = auto_ack
		self.queue = queue
		self.callback = callback

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
		pass

	def connect(self, host:str, queue:str):
		self.queue = queue
		self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=host))
		self.channel = self.connection.channel()
		self.channel.queue_declare(queue=self.queue)

	def publish(self, message):
		self.channel.basic_publish(exchange='', routing_key=self.queue, body=json.dumps(message))

	def stop(self):
		self.connection.close()