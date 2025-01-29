# Standard libraries
import logging
import asyncio

# Local modules
from app.pkg import itemConfig, ConfigItemType, __config__
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.configuration.loop.loop import loop
from app.pkg.ormar.dbormar import database
from app.configuration.settings import FREQUENCY, SEND_DEVICE_CONF, DEVICE_DATA_POLL
from app.ingternal.device.polling import restart_polling
from app.ingternal.device.send import restart_send_device_data
from app.moduls import getModule
from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.modules.arrays.serviceArray import ServiceArray
from app.ingternal.device.models.device import Device

# Logger setup
logger = logging.getLogger(__name__)

async def startup():
    # Initialize device registry
    servicesDataPoll.set(DEVICE_DATA_POLL, DeviceRegistry())

    # Connect to the database if not already connected
    database_ = database
    if not database_.is_connected:
        await database_.connect()

    # Register configuration items with the config manager
    __config__.register_config(
        itemConfig(tag="device service", key=FREQUENCY, type=ConfigItemType.NUMBER),
        restart_polling
    )
    __config__.register_config(
        itemConfig(tag="device service", key=SEND_DEVICE_CONF, type=ConfigItemType.NUMBER),
        restart_send_device_data
    )

    # Initialize the module
    getModule()

    # Print all device classes and services
    print(DeviceClasses.all())
    print(ServiceArray.services)

    # Start the service
    await ServiceArray.start()

    logger.info("generating config")

    # Load the configuration
    await __config__.load()

    # Start the main loop
    asyncloop = asyncio.get_running_loop()
    asyncloop.create_task(loop.run())

    logger.info("starting")

    # Print all devices
    print(await Device.objects.all())