import logging
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll

logger = logging.getLogger(__name__)

class ServiceMeta(type):
    def __new__(cls, clsname, bases, dct, use=True):
        new_class = super().__new__(cls, clsname, bases, dct)
        if use:
            try:
                servicesDataPoll.set(clsname, new_class)
                logger.info(f"Сервис {clsname} зарегистрирован в servicesDataPoll")
            except Exception as e:
                logger.error(f"Ошибка регистрации {clsname}: {e}")
        return new_class
