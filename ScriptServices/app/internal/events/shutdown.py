from app.internal.sender.device_set_value import sender_device
from app.internal.listener.device import devices_listener

import logging


logger = logging.getLogger(__name__)

async def shutdown():

	sender_device.disconnect()
	devices_listener.disconnect()

	logger.info("stop")
