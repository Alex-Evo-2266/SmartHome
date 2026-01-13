# app/ingternal/logs/get_logger.py
import logging
from app.internal.logs.handler_factory import build_file_handler

_LOGGER_HANDLERS: dict[str, bool] = {}

def get_logger(name: str, file: str):
    logger = logging.getLogger(f"app.{name}")

    if logger.name not in _LOGGER_HANDLERS:
        logger.addHandler(build_file_handler(file))
        logger.setLevel(logging.DEBUG) 
        logger.propagate = False
        _LOGGER_HANDLERS[logger.name] = True

    return logger
