# app/ingternal/logs/handler_factory.py
import logging
import os
from logging.handlers import TimedRotatingFileHandler
from app.configuration.settings import LOGS_DIR, LOGS_LEVEL

print(f"log_level: {LOGS_LEVEL}")

def build_file_handler(filename: str) -> logging.Handler:
    os.makedirs(LOGS_DIR, exist_ok=True)

    handler = TimedRotatingFileHandler(
        filename=os.path.join(LOGS_DIR, f"{filename}.log"),
        when="midnight",
        backupCount=7,
        encoding="utf-8",
    )

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - "
        "[%(filename)s:%(lineno)d] - %(message)s"
    )
    handler.setFormatter(formatter)
    handler.setLevel(LOGS_LEVEL)

    return handler
