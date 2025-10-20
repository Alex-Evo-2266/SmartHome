
class BaseSender:
    def __init__(self, logger, data_provider=None):
        """
        :param logger: объект логгера
        :param data_provider: async-функция, возвращающая данные (или None, если данные передаются напрямую)
        """
        self.logger = logger
        self.data_provider = data_provider
        self.publisher = None

    def connect(self, *args, **kwargs):
        """Создаётся publisher через create_publisher() в наследниках"""
        self.publisher = self.create_publisher(*args, **kwargs)
        self.publisher.connect()

    async def send(self, *args, **kwargs):
        self.logger.info(f"send {self.__class__.__name__}")
        if self.data_provider is not None:
            data = await self.data_provider()
        else:
            # если провайдера нет — данные должны передаваться напрямую
            if "data" not in kwargs:
                raise ValueError("No data_provider and no 'data' in kwargs")
            data = kwargs["data"]
        self.publisher.publish(data)

    def disconnect(self):
        if self.publisher:
            self.publisher.close()

    # абстрактный метод
    def create_publisher(self, *args, **kwargs):
        raise NotImplementedError

class QueueSender(BaseSender):
    """Отправка данных в конкретную очередь"""
    def create_publisher(self, queue_name, host):
        from .producer import RabbitMQProducer
        return RabbitMQProducer(host=host, queue_name=queue_name)


class FanoutSender(BaseSender):
    """Отправка данных в fanout exchange"""
    def create_publisher(self, exchange_name, host):
        from .producer import RabbitMQProducerFanout
        return RabbitMQProducerFanout(host=host, exchange_name=exchange_name)
