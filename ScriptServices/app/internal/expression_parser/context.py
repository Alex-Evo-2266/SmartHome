import copy
from app.internal.device.array.serviceDataPoll import roomDataPoll, deviceDataPoll

def g(confs: list[dict], devices: dict[str, dict]):
    values = []
    for dev_conf in confs:
        name = dev_conf.get("system_name")
        field = dev_conf.get("field")
        device = devices.get(name, None)
        if device is None:
            continue
        value = device.get(field, None)
        if value is None:
            continue
        values.append(value)
    if len(values) == 1:
        return values[0]
    return min(*values)

def get_context(room: list[dict], devices: dict):
    room_copy = copy.deepcopy(room)
    device_copy = copy.deepcopy(devices)
    for name in room_copy:
        for dev_name in room_copy[name]:
            for field_name in room_copy[name][dev_name]:
                room_copy[name][dev_name][field_name] = g(room_copy[name][dev_name][field_name], device_copy)
    print("p8888")
    return {
        "device": devices,
        "room": room_copy,
        "delay": {
            "method": {
                "args": ["time"],
                "call": lambda x, context_command = None: print(f"test 3 {x} com {context_command}")
            }
        },
        "test": {
            "test2": {
                "f":{
                    "method": {
                        "args": ["time"],
                        "call": lambda x, context_command = None: print(f"test 3 {x} com {context_command}")
                    }   
                }
            }
        }
    }
