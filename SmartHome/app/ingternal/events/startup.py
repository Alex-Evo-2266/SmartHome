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
from app.ingternal.device.save import save_device
from app.moduls import getModule
from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.device.models.device import Device

# Logger setup
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

async def startup():
    """
    Инициализация сервиса устройств.
    """
    logger.info("Starting device service...")

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
            restart_polling
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

    # Загрузка конфигурации
    try:
        await __config__.load()
        logger.info("Configuration loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load configuration: {e}")
        return

    # Регистрация задачи сохранения устройств
    save_device_conf = __config__.get(SAVE_DEVICE_CONF)
    if(save_device_conf.value == ''):
        save_device_conf.value = '6'
    if save_device_conf:
        loop.register(LOOP_SAVE_DEVICE, save_device, int(save_device_conf.value))
        logger.info(f"Device saving loop registered with frequency: {save_device_conf.value}")
    else:
        logger.warning("SAVE_DEVICE_CONF not found in config, skipping device save loop registration.")

    # Запуск основного цикла
    try:
        asyncloop = asyncio.get_running_loop()
        asyncloop.create_task(loop.run())
        logger.info("Main loop started.")
    except RuntimeError as e:
        logger.error(f"Failed to start main loop: {e}")

    logger.info("Device service started successfully.")