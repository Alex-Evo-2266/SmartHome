from app.ingternal.automation.schemas.automation import AutomationSchema


from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry

async def automation(data:AutomationSchema):
	print()
	print(data)
	print()
	dev:DeviceRegistry = servicesDataPoll.get('poll-device-data') 
	print(servicesDataPoll.get_all())
	print(dev.get_all())
	print()