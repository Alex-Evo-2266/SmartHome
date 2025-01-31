from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.schemas.enums import ReceivedDataFormat
from .settings import MQTT_MESSAGES, MQTT_DEVICE_CLASS
from .utils import get_value_from_token

import json

async def device_set_value(key, value):
    if key != MQTT_MESSAGES:
        return
    devices = DevicesArray.all()
    for device_cond in devices:
        device: IDevice = device_cond.device
        class_device = device.get_class()
        address_device = device.get_address()
        type_message = device.get_type_command()
        if(class_device == MQTT_DEVICE_CLASS and type_message == ReceivedDataFormat.JSON):
            data = get_value_from_token(address_device, value)
            if not data:
                continue
            json_data = json.loads(data)
            fields = device.get_fields()
            for field in fields:
                if field.get_address() in json_data:
                    new_data = json_data.get(field.get_address(), "")
                    field.set(json.dumps(new_data))
                    
