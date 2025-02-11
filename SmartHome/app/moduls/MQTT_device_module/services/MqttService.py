import paho.mqtt.client as mqtt
import logging, asyncio
from app.ingternal.modules.classes.baseService import BaseService
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from ..utils import update_topic_in_dict
from app.pkg import __config__
from ..settings import MQTT_PASSWORD, MQTT_BROKER_IP, MQTT_PORT, MQTT_USERNAME, MQTT_MESSAGES

logger = logging.getLogger(__name__)

class MqttService(BaseService):
    client = None
    callbacks = {}  # Словарь для хранения колбэков по топикам

    @classmethod
    async def start(cls):
        try:
            broker = __config__.get(MQTT_BROKER_IP)
            port = __config__.get(MQTT_PORT)
            user = __config__.get(MQTT_USERNAME)
            password = __config__.get(MQTT_PASSWORD)

            logger.info(f"Connecting to broker {broker.value} on port {port.value}.")

            cls.client = mqtt.Client()
            cls.client.username_pw_set(user.value, password.value)
            cls.client.on_connect = cls.on_connect
            cls.client.on_message = cls.on_message

            cls.client.connect(broker.value, int(port.value), 60)
            cls.client.loop_start()

            logger.info("MQTT Service started")

        except Exception as e:
            logger.error(f"Failed to start MQTT Service: {e}")

    @classmethod
    async def restart(cls):
        try:
            logger.info("Restarting MQTT service...")
            await cls.stop()
            await cls.start()
        except Exception as e:
            logger.error(f"Failed to restart MQTT Service: {e}")

    @classmethod
    async def stop(cls):
        try:
            if cls.client:
                cls.client.loop_stop()
                cls.client.disconnect()
                cls.client = None
                logger.info("MQTT Service stopped")
        except Exception as e:
            logger.error(f"Failed to stop MQTT Service: {e}")

    @classmethod
    def on_connect(cls, client, userdata, flags, rc):
        logger.info(f"Connected with result code {rc}")
        if rc == 0:
            client.subscribe("#")  # Подписка на все топики
        else:
            logger.error(f"Connection failed with code {rc}")

    @classmethod
    async def async_on_message(cls, msg):
        # Обновление данных
        topics = servicesDataPoll.get(MQTT_MESSAGES)
        new_topics = update_topic_in_dict(msg.topic, msg.payload.decode(), topics)
        await servicesDataPoll.set_async(MQTT_MESSAGES, new_topics)

        # Вызов всех подходящих колбэков (с учётом иерархии)
        for topic_pattern, callbacks in cls.callbacks.items():
            if cls.topic_matches(topic_pattern, msg.topic):
                for callback in callbacks:
                    try:
                        await callback(msg.topic, msg.payload.decode())
                    except Exception as e:
                        logger.error(f"Callback error for topic {msg.topic}: {e}")

    @classmethod
    def on_message(cls, client, userdata, msg):
        logger.info(f"Received message: {msg.payload.decode()} on topic {msg.topic}")
        asyncio.run(cls.async_on_message(msg))
        

    @classmethod
    def topic_matches(cls, pattern, topic):
        """
        Проверка соответствия топика шаблону (иерархическая проверка).
        """
        return topic.startswith(pattern)

    @classmethod
    def subscribe(cls, topic, callback):
        """
        Регистрация колбэка для определённого топика.
        """
        if topic not in cls.callbacks:
            cls.callbacks[topic] = []
            if cls.client:
                cls.client.subscribe(f"{topic}/#")  # Подписка на все вложенные топики
                logger.info(f"Subscribed to topic: {topic}/#")

        cls.callbacks[topic].append(callback)
        logger.info(f"Callback added for topic: {topic}")

    @classmethod
    def unsubscribe(cls, topic, callback=None):
        """
        Отписка от топика или удаление конкретного колбэка.
        """
        if topic in cls.callbacks:
            if callback:
                cls.callbacks[topic] = [cb for cb in cls.callbacks[topic] if cb != callback]
                logger.info(f"Callback removed for topic: {topic}")
            if not cls.callbacks[topic]:  # Если больше нет колбэков
                del cls.callbacks[topic]
                if cls.client:
                    cls.client.unsubscribe(f"{topic}/#")
                    logger.info(f"Unsubscribed from topic: {topic}/#")

    @classmethod
    def get_data(cls):
        return servicesDataPoll.get(MQTT_MESSAGES)

    @classmethod
    def run_command(cls, topic, message):
        try:
            if not topic or not message:
                logger.error("Error: Topic and message must be provided.")
                return
            if cls.client:
                cls.client.publish(topic, message)
                logger.info(f"Sent message: {message} to topic {topic}")
            else:
                logger.error("Error: MQTT client not initialized.")
        except Exception as e:
            logger.error(f"Failed to send message: {e}")