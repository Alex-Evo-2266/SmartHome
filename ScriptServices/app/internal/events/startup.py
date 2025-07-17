# Standard libraries
import logging
import asyncio
from typing import Dict, List

# Local modules
from app.pkg.ormar.dbormar import database
from .utils.create_dirs import create_directorys
from app.internal.device.array.serviceDataPoll import deviceDataPoll, roomDataPoll
from app.internal.sender.device_set_value import sender_device
from app.internal.listener.device import devices_listener
from app.internal.listener.script import script_listener
from app.internal.listener.room import rooms_listener
from app.configuration.settings import DEVICE_VALUE_SEND, EXCHANGE_DEVICE_DATA, DATA_SCRIPT, EXCHANGE_ROOM_DATA
from app.internal.logs import get_base_logger
from app.internal.run_script.run import run_script
from app.internal.script.serialize.parse_room_listener_data import parse_room_data

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

    def setDevice(method, properties, body):
        print(body["lamp1"])
        deviceDataPoll._data = body
        
    def setRoom(method, properties, body):
        print("rooms ", body)
        try:
            for data in body:
                asyncio.run(roomDataPoll.set_async(data["room_name"], parse_room_data(data)))
        except Exception as e:
            print("error", e)


    devices_listener.connect(EXCHANGE_DEVICE_DATA, setDevice)
    rooms_listener.connect(EXCHANGE_ROOM_DATA, setRoom)
    script_listener.connect(DATA_SCRIPT, run_script)

    logger.info("Script service started successfully.")