from typing import Dict, Type

from app.exceptions.device import ClassAlreadyExistsException, DeviceClassNotFound
from app.core.ports.interface.device_class import IDevice
from app.schemas.device.device import DeviceSerializeSchema
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

class DeviceClasses:
    def __init__(self):
        self._classes: Dict[str, Type[IDevice]] = dict()

    # Добавление нового класса устройства
    def add(self, class_name: str, new_class: Type[IDevice]) -> None:
        if class_name in self._classes:
            logger.warning(f"Class '{class_name}' already exists, cannot add again.")
            raise ClassAlreadyExistsException(f"Class '{class_name}' already exists.")
        logger.info(f"Added device class: {class_name}")
        self._classes[class_name] = new_class

    # Очистка всех классов устройств
    def clear(self) -> None:
        logger.info("Clearing all device classes.")
        self._classes.clear()

    # Получение класса устройства по имени
    def get(self, class_name: str) -> Type[IDevice]:
        if class_name not in self._classes:
            logger.error(f"Device class '{class_name}' not found.")
            raise DeviceClassNotFound(f"Device class '{class_name}' not found.")
        logger.info(f"Retrieved device class: {class_name}")
        return self._classes[class_name]

    # Получение всех классов устройств
    def all(self) -> Dict[str, Type[IDevice]]:
        logger.info("Retrieved all device classes.")
        return self._classes

    # Создание экземпляра устройства по имени класса и данным
    def get_device(self, class_name: str, data: DeviceSerializeSchema) -> IDevice:
        logger.info(f"Creating device from class '{class_name}' with data: {data.dict()}")
        device_class = self.get(class_name)  # Используем метод get для упрощения
        device = device_class(**data.dict())  # Преобразуем данные в параметры
        logger.info(f"Created device: {device}")
        return device