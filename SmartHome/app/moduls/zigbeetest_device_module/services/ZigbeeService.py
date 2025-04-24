from app.ingternal.modules.classes.baseService import BaseService
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import SERVICE_POLL, SERVICE_DATA_POLL
from ..settings import MQTT_SERVICE_PATH, ZIGBEE_SERVICE_COORDINATOR_INFO_PATH
import json
from typing import Dict

async def f(topic, message):
    print("p700", topic, message)

def get_format(permit_join):
    return {"permit_join": permit_join}

class ZigbeeServiceCoordinator():
    def __init__(self, root):
        service:ObservableDict = servicesDataPoll.get(SERVICE_POLL)
        self.mqtt = service.get(MQTT_SERVICE_PATH)
        self.root = root
        self.mqtt.subscribe(f"{self.root}/bridge/devices", f)
        self.mqtt.subscribe(f"{self.root}/bridge/info", self.info_bridge_pars)

    def stop(self):
        self.mqtt.unsubscribe(f"{self.root}/bridge/devices", f)
        self.mqtt.unsubscribe(f"{self.root}/bridge/info", self.info_bridge_pars)

    async def info_bridge_pars(self, topic, message):
        data = json.loads(message)
        permit_join = data.get("permit_join", None)
        services_data: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
        cordinators_info = services_data.get(ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, {})
        cordinators_info[self.root] = get_format(permit_join)
        services_data.set(ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, cordinators_info)

    def set_permit_join(self, state: bool):
        self.mqtt.run_command(f"{self.root}/bridge/request/permit_join", json.dumps({"value": state, "time": 60}))

    def on_load_data(self, data):
        if isinstance(data, dict):
            type_command = data.get("command", None)
            value_command = data.get("status", None)
            if value_command is None:
                return
            if type_command == "link":
                self.set_permit_join(value_command)

class ZigbeeService(BaseService):
    cordinators:Dict[str, ZigbeeServiceCoordinator] = {}
    @classmethod
    async def start(cls):
        cls.cordinators['zigbee2mqtt'] = ZigbeeServiceCoordinator('zigbee2mqtt')

    @classmethod
    async def stop(cls):
        for key in cls.cordinators:
            cls.cordinators[key].stop()

    @classmethod
    async def set_permit_join(cls, root_topic:str, state:bool):
        cordinator = cls.cordinators.get(root_topic, None)
        if cordinator:
            cordinator.set_permit_join(state)

    @classmethod
    def on_load_data(cls, data):
        if isinstance(data, dict):
            for key in data:
                cordinator = cls.cordinators.get(key, None)
                if not cordinator is None:
                    cordinator.on_load_data(data[key])
