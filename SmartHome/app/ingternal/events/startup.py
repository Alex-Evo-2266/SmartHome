# Standard libraries
import logging
import asyncio

# Local modules
from app.pkg import itemConfig, ConfigItemType, __config__
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.configuration.loop.loop import loop
from app.pkg.ormar.dbormar import database
from app.configuration.settings import FREQUENCY, SEND_DEVICE_CONF, DEVICE_DATA_POLL, LOOP_SAVE_DEVICE, SAVE_DEVICE_CONF
from app.ingternal.device.polling import restart_polling
from app.ingternal.device.send import restart_send_device_data
from app.ingternal.device.save import restart_save_data
from app.moduls import getModule
from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.device.models.device import Device
from .utils.create_dirs import create_directorys
from app.ingternal.automation.run.run_automation import restart_automation
from app.ingternal.automation.run.register import register_automation

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
logger = logging.getLogger(__name__)

async def startup():
    """
    Инициализация сервиса устройств.
    """
    logger.info("Starting device service...")

    logger.info("Starting create dirs...")
    create_directorys()

    # Инициализация DeviceRegistry
    servicesDataPoll.set(DEVICE_DATA_POLL, DeviceRegistry())
    logger.info("Device registry initialized.")

    # Подключение к базе данных
    database_ = database
    if not database_.is_connected:
        try:
            await database_.connect()
            logger.info("Database connection established.")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            return  # Прерываем запуск при ошибке

    # Регистрация конфигурационных параметров
    try:
        __config__.register_config(
            itemConfig(tag="device service", key=FREQUENCY, type=ConfigItemType.NUMBER),
            restart_polling
        )
        __config__.register_config(
            itemConfig(tag="device service", key=SAVE_DEVICE_CONF, type=ConfigItemType.NUMBER),
            restart_save_data
        )
        __config__.register_config(
            itemConfig(tag="device service", key=SEND_DEVICE_CONF, type=ConfigItemType.NUMBER),
            restart_send_device_data
        )
        logger.info("Configuration items registered.")
    except Exception as e:
        logger.error(f"Error registering configuration items: {e}")

    # Инициализация модулей
    try:
        await getModule()
        logger.info("Modules initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing modules: {e}")

    # Вывод списка всех классов устройств
    device_classes = DeviceClasses.all()
    logger.info(f"Loaded device classes: {device_classes}")

    logger.info("Generating config...")

    await register_automation()

    await restart_automation()

    # Загрузка конфигурации
    try:
        await __config__.load()
        logger.info("Configuration loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load configuration: {e}")
        return

    # Запуск основного цикла
    try:
        asyncloop = asyncio.get_running_loop()
        asyncloop.create_task(loop.run())
        asyncloop.create_task(monitor_memory())
        logger.info("Main loop started.")
    except RuntimeError as e:
        logger.error(f"Failed to start main loop: {e}")

    logger.info("Device service started successfully.")