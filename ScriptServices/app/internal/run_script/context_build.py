import copy
from app.internal.script.schemas.room import RoomData, RoomDeviceData
from typing import List, Dict
from app.internal.run_script.methods.delay import delay

def g(confs: List[RoomDeviceData], devices: dict[str, dict]):
    values = []
    for dev_conf in confs:
        name = dev_conf.device_name
        field = dev_conf.field_name
        device = devices.get(name, None)
        if device is None:
            continue
        val = device.get("value", None)
        if val is None:
            continue
        value = val.get(field, None)
        if value is None:
            continue
        values.append(value)
    if len(values) == 0:
        return "0"
    if len(values) == 1:
        return values[0]
    return min(*values)

def get_context(room: List[RoomData], devices_objs: dict):
    
    room_copy = copy.deepcopy(room)
    room_data_res:dict = {}
    _devices = {
        devices_objs[key]["system_name"]: {
            x["name"]: devices_objs[key]["value"].get(x["name"],None) for x in devices_objs[key]["fields"]
        } for key in devices_objs
    }
    for room_data in room_copy:
        name = room_data.room_name
        devices:Dict[str, Dict[str, List[RoomDeviceData]]] = room_data.devices
        if not name in room_data_res:
            room_data_res[name] = {}
        for dev_name in devices:
            if not dev_name in room_data_res[name]:
                room_data_res[name][dev_name] = {}
            for field_name in devices[dev_name]:
                room_data_res[name][dev_name][field_name] = g(devices[dev_name][field_name], devices_objs)
    return {
        "device": _devices,
        "room": room_copy,
        "delay": {
            "method": {
                "args": ["time"],
                "call": delay
            }
        }
    }
