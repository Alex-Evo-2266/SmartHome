from app.ingternal.modules.classes.baseService import BaseService
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import SERVICE_POLL, SERVICE_DATA_POLL
from ..settings import MQTT_SERVICE_PATH, ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, ZIGBEE_DEVICE_CLASS
import json, logging
from typing import Dict, Any
from uuid import uuid4
from app.ingternal.logs.logs import LogManager

from app.ingternal.device.device_edit_queue.device_queue import DeviceQueue, Types
from app.ingternal.device.schemas.add_device import AddDeviceSchema, AddDeviceFieldSchema, ReceivedDataFormat, DeviceGetData, TypeDeviceField
from ..device_field_set import device_set_value

from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict, servicesDataPoll
from app.configuration.settings import DEVICE_DATA_POLL

# Настройка логирования
logger = logging.getLogger(__name__)
logsHandler = LogManager("zigbeeServiceLogs", level=logging.DEBUG)
logger.addHandler(logsHandler.get_file_handler())
logger.setLevel(logging.DEBUG)

def get_format(permit_join):
    return {"permit_join": permit_join}

def get_low(field_data):
    cond = field_data.get("value_off", None) if field_data["type"] == "binary" else field_data.get("value_min", None)
    return cond if cond is None else str(cond)
def get_high(field_data):
    cond = field_data.get("value_on", None) if field_data["type"] == "binary" else field_data.get("value_max", None)
    return cond if cond is None else str(cond)

def map_type(type:str)->TypeDeviceField:
    types={
        "numeric": TypeDeviceField.NUMBER,
        "binary": TypeDeviceField.BINARY,
        "enum": TypeDeviceField.ENUM,
    }
    return types.get(type, TypeDeviceField.TEXT)

class ZigbeeServiceCoordinator():
    def __init__(self, root):
        service:ObservableDict = servicesDataPoll.get(SERVICE_POLL)
        self.mqtt = service.get(MQTT_SERVICE_PATH)
        self.root = root
        self.mqtt.subscribe(f"{self.root}/bridge/devices", self.on_device)
        self.mqtt.subscribe(f"{self.root}/bridge/info", self.on_info_bridge_pars)
        self.mqtt.subscribe(f"{self.root}/bridge/event", self.on_event)

    def stop(self):
        self.mqtt.unsubscribe(f"{self.root}/bridge/devices", self.on_device)
        self.mqtt.unsubscribe(f"{self.root}/bridge/info", self.on_info_bridge_pars)
        self.mqtt.unsubscribe(f"{self.root}/bridge/event", self.on_event)

    async def on_device(self, topic, message):
        pass

    async def on_info_bridge_pars(self, topic, message):
        data = json.loads(message)
        permit_join = data.get("permit_join", None)
        services_data: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
        cordinators_info = services_data.get(ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, {})
        cordinators_info[self.root] = get_format(permit_join)
        services_data.set(ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, cordinators_info)

    def set_permit_join(self, state: bool):
        self.mqtt.run_command(f"{self.root}/bridge/request/permit_join", json.dumps({"value": state, "time": 60}))

    
    async def on_event(self, topic: str, message: Any) -> None:
        """
        Обработчик событий Zigbee-моста с детальным логированием
        
        Args:
            topic: MQTT-топик, откуда пришло сообщение
            message: Данные события (может быть строкой или словарем)
        """
        try:
            # Логируем входящее сообщение
            logger.debug(f"Получено сообщение из топика {topic}: {message}")
            
            if not isinstance(message, (str, dict)):
                logger.warning(f"Неподдерживаемый тип сообщения: {type(message)}")
                return

            # Если сообщение в формате JSON-строки
            if isinstance(message, str):
                try:
                    message = json.loads(message)
                    logger.debug("Сообщение успешно распарсено из JSON")
                except json.JSONDecodeError as e:
                    logger.error(f"Ошибка парсинга JSON: {e}")
                    return

            # Проверяем обязательные поля
            if not isinstance(message, dict):
                logger.warning("После парсинга сообщение не является словарем")
                return

            event_type = message.get("type")
            if not event_type:
                logger.debug("Сообщение не содержит тип события")
                return

            logger.info(f"Обработка события типа: {event_type}")

            if event_type == "device_interview":
                await self._handle_device_interview(message)
            elif event_type == "device_leave":
                data = message.get("data")
                if not data:
                    logger.warning("Отсутствует data в сообщении device_interview")
                    return
                ieee_address = data.get("ieee_address")
                if not ieee_address:
                    logger.warning("Отсутствует IEEE-адрес устройства")
                    return
                devices:ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
                devices_schemas = devices.get_all_data()
                logger.debug(f"p9800 {devices_schemas}")
                for device in devices_schemas:
                    if device.address == f"{self.root}/{ieee_address}":
                        DeviceQueue.add(Types.STATUS, key=device.system_name, value=False)
                        logger.info(f"Успешно изменена модель устройства {device.system_name}")
                        return 
            else:
                logger.debug(f"Событие типа {event_type} не обрабатывается")

        except Exception as e:
            logger.exception(f"Критическая ошибка при обработке события: {e}")

    async def _handle_device_interview(self, message: dict) -> None:
        """Обработка события интервью устройства"""
        try:
            data = message.get("data")
            if not data:
                logger.warning("Отсутствует data в сообщении device_interview")
                return

            definition = data.get("definition")
            if not definition:
                logger.warning("Устройство не содержит definition")
                return

            ieee_address = data.get("ieee_address")
            if not ieee_address:
                logger.warning("Отсутствует IEEE-адрес устройства")
                return
            
            logger.info(f"Начато интервью устройства {ieee_address} ({definition.get('model')})")

            devices:ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
            devices_schemas = devices.get_all_data()
            logger.debug(f"p9800 {devices_schemas}")
            for device in devices_schemas:
                if device.address == f"{self.root}/{ieee_address}":
                    DeviceQueue.add(Types.STATUS, key=device.system_name, value=True)
                    logger.info(f"Успешно изменена модель устройства {device.system_name}")
                    return 
            logger.debug([field_data for field_data in definition.get("exposes", [])])
            # Создание модели устройства
            fields = [self.exposes_pars2(item) for item in definition.get("exposes", [])]
            logger.debug(f"test field {fields}")
            device = AddDeviceSchema(
                name=definition["model"],
                system_name=str(uuid4().hex),
                class_device=ZIGBEE_DEVICE_CLASS,
                address=f"{self.root}/{ieee_address}",
                type_command=ReceivedDataFormat.JSON,
                type_get_data=DeviceGetData.PUSH,
                fields=[x for item in definition.get("exposes", []) for x in self.exposes_pars2(item)]
            )

            logger.info(f"Успешно создана модель устройства {device.name} (IEEE: {ieee_address})")
            logger.debug(f"Детали устройства: {device}")

            DeviceQueue.add(Types.ADD ,key="", value=device)

        except KeyError as e:
            logger.error(f"Отсутствует обязательное поле {e} в данных устройства")
        except ValueError as e:
            logger.error(f"Ошибка валидации данных устройства: {e}")
        except Exception as e:
            logger.exception(f"Ошибка обработки device_interview: {e}")
    
    def exposes_pars2(self, data):
        type_exposes = data.get("type")
        if not type_exposes:
            logger.warning("Устройство не содержит definition")
            return
        if type_exposes == "binary":
            return [AddDeviceFieldSchema(
                name=data["name"]+str(data.get("endpoint", "")),
                address=data["property"],
                type=TypeDeviceField.BINARY,
                low=data.get("value_off", None),
                high=data.get("value_on", None),
                read_only=("category" in data and data["category"] == "diagnostic"),
                entity=None,
                icon="",
                unit=data.get("unit", None),
                virtual_field=False,
                category=data.get("category", None)
            )]
        if type_exposes == "numeric":
            return [AddDeviceFieldSchema(
                name=data["name"]+str(data.get("endpoint", "")),
                address=data["property"],
                type=TypeDeviceField.NUMBER,
                low= None if data.get("value_min", None) is None else str(data.get("value_min", None)) ,
                high= None if data.get("value_max", None) is None else str(data.get("value_max", None)) ,
                read_only=("category" in data and data["category"] == "diagnostic"),
                entity=None,
                icon="",
                unit=data.get("unit", None),
                virtual_field=False,
                category=data.get("category", None)
            )]
        if type_exposes == "enum":
            return [AddDeviceFieldSchema(
                name=data["name"]+str(data.get("endpoint", "")),
                address=data["property"],
                type=TypeDeviceField.ENUM,
                read_only=("category" in data and data["category"] == "diagnostic"),
                entity=None,
                icon="",
                enum_values=", ".join(data.get("values",[])),
                unit=data.get("unit", None),
                category=data.get("category", None),
                virtual_field=False
            )]
        if type_exposes == "text":
            return [AddDeviceFieldSchema(
                name=data["name"]+str(data.get("endpoint", "")),
                address=data["property"],
                type=TypeDeviceField.TEXT,
                read_only=("category" in data and data["category"] == "diagnostic"),
                entity=None,
                icon="",
                unit=data.get("unit", None),
                category=data.get("category", None),
                virtual_field=False
            )]
        if type_exposes == "switch":
            return [x for item in data["features"] for x in self.exposes_pars2(item)]
        if type_exposes == "light":
            return [x for item in data["features"] for x in self.exposes_pars2(item)]



    def on_load_data(self, data):
        if isinstance(data, dict):
            type_command = data.get("command", None)
            value_command = data.get("status", None)
            if value_command is None:
                return
            if type_command == "link":
                self.set_permit_join(value_command)

class ZigbeeService(BaseService):
    cordinators:Dict[str, ZigbeeServiceCoordinator] = {}
    @classmethod
    async def start(cls):
        cls.cordinators['zigbee2mqtt'] = ZigbeeServiceCoordinator('zigbee2mqtt')
        service:ObservableDict = servicesDataPoll.get(SERVICE_POLL)
        cls.mqtt = service.get(MQTT_SERVICE_PATH)
        cls.mqtt.subscribe("", device_set_value)

    @classmethod
    async def stop(cls):
        cls.mqtt.unsubscribe("", device_set_value)
        for key in cls.cordinators:
            cls.cordinators[key].stop()

    @classmethod
    async def set_permit_join(cls, root_topic:str, state:bool):
        cordinator = cls.cordinators.get(root_topic, None)
        if cordinator:
            cordinator.set_permit_join(state)

    @classmethod
    def on_load_data(cls, data):
        if isinstance(data, dict):
            for key in data:
                cordinator = cls.cordinators.get(key, None)
                if not cordinator is None:
                    cordinator.on_load_data(data[key])
