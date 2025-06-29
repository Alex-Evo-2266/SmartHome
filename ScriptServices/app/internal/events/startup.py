# Standard libraries
import logging
import asyncio
from typing import Dict, List

# Local modules
from app.pkg.ormar.dbormar import database
from .utils.create_dirs import create_directorys
from app.internal.device.array.serviceDataPoll import servicesDataPoll
from app.internal.sender.device_set_value import sender_device
from app.internal.listener.device import devices_listener
from app.internal.listener.script import script_listener
from app.configuration.settings import DEVICE_VALUE_SEND, EXCHANGE_DEVICE_DATA, DATA_SCRIPT
from app.internal.logs import get_base_logger

import tracemalloc

tracemalloc.start()

def count_duplicates(arr):
    counts = {}
    for item in arr:
        counts[item] = counts.get(item, 0) + 1
    return counts

async def monitor_memory(data:str = ""):
    while True:
        current, peak = tracemalloc.get_traced_memory()
        active_tasks2 = len(asyncio.all_tasks())
        print(f"{data} Активные задачи: {active_tasks2}")
        print(f"{data} Использование памяти: {current / 1024:.2f} KB, Пик: {peak / 1024:.2f} KB")
        print("tasks")
        tasks = [a.get_name() for a in asyncio.all_tasks()]
        print(count_duplicates(tasks))
        print()
        await asyncio.sleep(1)

# Logger setup
# logger = logging.getLogger(__name__)
logger = get_base_logger.get_logger(__name__)

async def startup():
    """
    Инициализация сервиса устройств.
    """
    logger.info("Starting device service...")

    logger.info("Starting create dirs...")
    create_directorys()

    # Подключение к базе данных
    database_ = database
    if not database_.is_connected:
        try:
            await database_.connect()
            logger.info("Database connection established.")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            return  # Прерываем запуск при ошибке

    sender_device.connect(DEVICE_VALUE_SEND)

    def df(method, properties, body):
        logger.info(f"load device")

    devices_listener.connect(EXCHANGE_DEVICE_DATA, df)
    script_listener.connect(DATA_SCRIPT, df)

    logger.info("Device service started successfully.")