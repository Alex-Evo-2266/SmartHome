import paho.mqtt.client as mqtt
import logging, asyncio
from app.ingternal.logs.logs import LogManager
from app.ingternal.modules.classes.baseService import BaseService
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from ..utils import update_topic_in_dict
from app.pkg import __config__
from ..settings import MQTT_PASSWORD, MQTT_BROKER_IP, MQTT_PORT, MQTT_USERNAME, MQTT_MESSAGES
from app.configuration.settings import SERVICE_DATA_POLL

# Настройка логирования
logger = logging.getLogger(__name__)
logsHandler = LogManager("mqttServiceLogs", level=logging.DEBUG)
logger.addHandler(logsHandler.get_file_handler())
logger.setLevel(logging.DEBUG)

class MqttService(BaseService):
    client = None
    callbacks = {}  # Словарь для хранения колбэков по топикам
    _connection_attempts = 0
    MAX_CONNECTION_ATTEMPTS = 3

    @classmethod
    async def start(cls):
        try:
            broker = __config__.get(MQTT_BROKER_IP)
            port = __config__.get(MQTT_PORT)
            user = __config__.get(MQTT_USERNAME)
            password = __config__.get(MQTT_PASSWORD)

            logger.info(f"Attempting to connect to MQTT broker at {broker.value}:{port.value}")
            logger.debug(f"Connection details - username: {user.value}, password: {'*' * len(password.value)}")

            cls.client = mqtt.Client()
            cls.client.username_pw_set(user.value, password.value)
            cls.client.on_connect = cls.on_connect
            cls.client.on_message = cls.on_message
            cls.client.on_disconnect = cls.on_disconnect
            cls.client.on_log = cls.on_log  # Добавляем обработчик логов MQTT

            cls._connection_attempts += 1
            cls.client.connect(broker.value, int(port.value), keepalive=60)
            cls.client.loop_start()

            logger.info("MQTT client started successfully")

        except Exception as e:
            logger.error(f"Failed to start MQTT Service: {str(e)}", exc_info=True)
            if cls._connection_attempts < cls.MAX_CONNECTION_ATTEMPTS:
                logger.warning(f"Retrying connection ({cls._connection_attempts}/{cls.MAX_CONNECTION_ATTEMPTS})...")
                await asyncio.sleep(2)
                await cls.start()
            else:
                logger.critical("Max connection attempts reached. Giving up.")

    @classmethod
    def on_log(cls, client, userdata, level, buf):
        """Обработчик внутренних логов MQTT клиента"""
        if level == mqtt.MQTT_LOG_ERR:
            logger.error(f"MQTT Client Error: {buf}")
        elif level == mqtt.MQTT_LOG_WARNING:
            logger.warning(f"MQTT Client Warning: {buf}")
        elif level == mqtt.MQTT_LOG_NOTICE:
            logger.info(f"MQTT Client Notice: {buf}")
        else:
            logger.debug(f"MQTT Client Debug: {buf}")

    @classmethod
    def on_disconnect(cls, client, userdata, rc):
        """Обработчик дисконекта"""
        if rc != 0:
            logger.error(f"Unexpected MQTT disconnection. Reason: {rc} - {mqtt.error_string(rc)}")
            logger.info("Attempting to reconnect...")
            asyncio.create_task(cls._handle_reconnection())
        else:
            logger.info("MQTT client disconnected gracefully")

    @classmethod
    async def _handle_reconnection(cls):
        """Обработка повторного подключения"""
        try:
            await cls.stop()
            await asyncio.sleep(5)  # Задержка перед повторным подключением
            await cls.start()
        except Exception as e:
            logger.error(f"Reconnection attempt failed: {str(e)}", exc_info=True)

    @classmethod
    async def restart(cls):
        try:
            logger.info("Initiating MQTT service restart...")
            await cls.stop()
            await asyncio.sleep(1)
            await cls.start()
            logger.info("MQTT service restarted successfully")
        except Exception as e:
            logger.error(f"Failed to restart MQTT Service: {str(e)}", exc_info=True)

    @classmethod
    async def stop(cls):
        try:
            if cls.client:
                logger.info("Stopping MQTT client...")
                cls.client.loop_stop()
                cls.client.disconnect()
                cls.client = None
                cls._connection_attempts = 0
                logger.info("MQTT client stopped successfully")
        except Exception as e:
            logger.error(f"Failed to stop MQTT Service: {str(e)}", exc_info=True)

    @classmethod
    def on_connect(cls, client, userdata, flags, rc):
        cls._connection_attempts = 0  # Сброс счетчика попыток при успешном подключении
        if rc == 0:
            logger.info("Connected to MQTT broker successfully")
            client.subscribe("#")
            logger.debug("Subscribed to all topics (#)")
        else:
            error_msg = mqtt.connack_string(rc)
            logger.error(f"Connection failed with code {rc}: {error_msg}")
            if rc == 5:
                logger.error("Authentication error. Please check username/password")

    @classmethod
    async def async_on_message(cls, msg):
        logger.debug(f"Message received - Topic: {msg.topic}, Payload: {msg.payload.decode()}")
        try:
            # Обновление данных
            services_data:ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
            topics = services_data.get(MQTT_MESSAGES)
            new_topics = update_topic_in_dict(msg.topic, msg.payload.decode(), topics)
            await services_data.set_async(MQTT_MESSAGES, new_topics)

            # Вызов всех подходящих колбэков (с учётом иерархии)
            callback_count = 0
            for topic_pattern, callbacks in cls.callbacks.items():
                if cls.topic_matches(topic_pattern, msg.topic):
                    for callback in callbacks:
                        try:
                            await callback(msg.topic, msg.payload.decode())
                            callback_count += 1
                        except Exception as e:
                            logger.error(
                                    f"Callback error for topic {msg.topic}: {str(e)}",
                                    exc_info=True
                                )
            if callback_count > 0:
                logger.debug(f"Executed {callback_count} callbacks for topic {msg.topic}")
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}", exc_info=True)

    @classmethod
    def on_message(cls, client, userdata, msg):
        try:
            asyncio.run(cls.async_on_message(msg))
        except RuntimeError as e:
            if "Event loop is closed" in str(e):
                logger.warning("Event loop closed, creating new one for message processing")
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(cls.async_on_message(msg))
                loop.close()
            else:
                logger.error(f"Error processing message: {str(e)}", exc_info=True)
        except Exception as e:
            logger.error(f"Unexpected error in on_message: {str(e)}", exc_info=True)
        

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
        try:
            if topic not in cls.callbacks:
                cls.callbacks[topic] = []
                if cls.client:
                    cls.client.subscribe(f"{topic}/#")
                    logger.info(f"Subscribed to topic hierarchy: {topic}/#")
                    logger.debug(f"Current subscriptions: {cls.callbacks.keys()}")

            cls.callbacks[topic].append(callback)
            logger.info(f"Added callback for topic: {topic}. Total callbacks: {len(cls.callbacks[topic])}")
        except Exception as e:
            logger.error(f"Error in subscribe: {str(e)}", exc_info=True)

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
        services_data:ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
        return services_data.get(MQTT_MESSAGES)

    @classmethod
    def run_command(cls, topic, message, qos=0, retain=False):
        try:
            if not topic or not message:
                logger.error("Publish failed: topic and message must be provided")
                return False
            
            if cls.client:
                result = cls.client.publish(topic, message, qos=qos, retain=retain)
                if result.rc == mqtt.MQTT_ERR_SUCCESS:
                    logger.info(f"Message published - Topic: {topic}, QoS: {qos}, Retain: {retain}")
                    logger.debug(f"Message content: {message}")
                    return True
                else:
                    logger.error(f"Publish failed with code {result.rc}: {mqtt.error_string(result.rc)}")
                    return False
            else:
                logger.error("Publish failed: MQTT client not initialized")
                return False
        except Exception as e:
            logger.error(f"Error in run_command: {str(e)}", exc_info=True)
            return False



        # try:
        #     if not topic or not message:
        #         logger.error("Error: Topic and message must be provided.")
        #         return
        #     if cls.client:
        #         cls.client.publish(topic, message)
        #         logger.info(f"Sent message: {message} to topic {topic}")
        #     else:
        #         logger.error("Error: MQTT client not initialized.")
        # except Exception as e:
        #     logger.error(f"Failed to send message: {e}")