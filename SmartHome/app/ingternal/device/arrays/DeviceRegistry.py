import logging
from typing import List
from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict

logger = logging.getLogger(__name__)

# Подкласс для хранения устройств
class DeviceRegistry(ObservableDict):
    def __init__(self):
        super().__init__()
        logger.info("DeviceRegistry инициализирован")

    def get_all_devices(self) -> List[dict]:
        """Возвращает список всех устройств."""
        return list(self._data.values())