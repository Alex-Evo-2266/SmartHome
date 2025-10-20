from app.internal.sender.device_set_value import sender_device
from app.internal.listener.listener import loadDeviceData, loadRoomData, loadScriptData
from app.configuration.loop.loop import loop

import logging


logger = logging.getLogger(__name__)

async def shutdown():

	sender_device.disconnect()
	
	loadDeviceData.stop()
	loadScriptData.stop()
	loadRoomData.stop()
	loop.stop()

	logger.info("stop")
