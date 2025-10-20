import logging
from typing import Dict, Type

from app.ingternal.device.exceptions.device import ClassAlreadyExistsException, DeviceNotFound
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.schemas.device import DeviceSerializeSchema

logger = logging.getLogger(__name__)

class DeviceClasses:
    _classes: Dict[str, Type[IDevice]] = dict()

    # Добавление нового класса устройства
    @classmethod
    def add(cls, class_name: str, new_class: Type[IDevice]) -> None:
        if class_name in cls._classes:
            logger.warning(f"Class '{class_name}' already exists, cannot add again.")
            raise ClassAlreadyExistsException(f"Class '{class_name}' already exists.")
        logger.info(f"Added device class: {class_name}")
        cls._classes[class_name] = new_class

    # Очистка всех классов устройств
    @classmethod
    def clear(cls) -> None:
        logger.info("Clearing all device classes.")
        cls._classes.clear()

    # Получение класса устройства по имени
    @classmethod
    def get(cls, class_name: str) -> Type[IDevice]:
        if class_name not in cls._classes:
            logger.error(f"Device class '{class_name}' not found.")
            raise DeviceNotFound(f"Device class '{class_name}' not found.")
        logger.info(f"Retrieved device class: {class_name}")
        return cls._classes[class_name]

    # Получение всех классов устройств
    @classmethod
    def all(cls) -> Dict[str, Type[IDevice]]:
        logger.info("Retrieved all device classes.")
        return cls._classes

    # Создание экземпляра устройства по имени класса и данным
    @classmethod
    def get_device(cls, class_name: str, data: DeviceSerializeSchema) -> IDevice:
        logger.info(f"Creating device from class '{class_name}' with data: {data.dict()}")
        device_class = cls.get(class_name)  # Используем метод get для упрощения
        device = device_class(**data.dict())  # Преобразуем данные в параметры
        logger.info(f"Created device: {device}")
        return device