from app.ingternal.modules.classes.baseModules import BaseModule
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import SERVICE_POLL, SERVICE_DATA_POLL
from .settings import ZIGBEE_SERVICE_PATH, ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, ZIGBEE_SERVICE_COORDINATOR_DEVICE_PATH
from .services.ZigbeeService import ZigbeeService
from typing import Optional

class Module(BaseModule):
    
    @classmethod
    async def start(cls):
        await super().start()

        services: ObservableDict = servicesDataPoll.get(SERVICE_POLL)
        zigbee_service: Optional[ZigbeeService] = services.get(ZIGBEE_SERVICE_PATH)
        services_data: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
        services_data.set(ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, {})
        services_data.set(ZIGBEE_SERVICE_COORDINATOR_DEVICE_PATH, {})

        print(zigbee_service)

        if zigbee_service:
            await zigbee_service.start()

