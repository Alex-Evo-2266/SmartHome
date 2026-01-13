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

def get_base_context():
    
    return {
        "delay": {
            "_method": {
                "args": ["time"],
                "call": delay
            }
        }
    }


def build_device_context(devices: dict) -> dict:
    """
    device.<name>:
      - _meta  → служебная информация
      - <field>._value
      - <field>._method
    """
    ctx: dict = {}

    for device_name, device in devices.items():
        device_ctx = {}

        # --- meta ---
        device_ctx["_meta"] = {
            "name": device.get("name", device_name),
            "system_name": device.get("system_name", device_name),
            "room": device.get("room"),
            # "type": device.get("type"),
        }

        values = device.get("value", {})
        if not isinstance(values, dict):
            continue

        for field_name, raw_value in values.items():
            if field_name.startswith("__"):
                continue

            # async def setter(
            #     val,
            #     *,
            #     _device=device_ctx["_meta"]["system_name"],
            #     _field=field_name,
            #     context_command=None,
            #     **_
            # ):
            #     await sender_device.send(
            #         data={
            #             "system_name": _device,
            #             "field": _field,
            #             "value": val
            #         }
            #     )

            device_ctx[field_name] = {
                "_value": raw_value,
                # "_method": {
                #     "call": setter
                # }
            }

        ctx[device_name] = device_ctx

    return ctx

def build_room_context(room: dict) -> dict:
    """
    Преобразует room-срез в context для evaluate_call.
    Все поля read-only: только _value, без _method.
    """
    ctx: dict = {}

    for room_name, types in room.items():
        ctx[room_name] = {}

        if not isinstance(types, dict):
            continue

        for type_name, fields in types.items():
            ctx[room_name][type_name] = {}

            if not isinstance(fields, dict):
                continue

            for field_name, raw_value in fields.items():
                ctx[room_name][type_name][field_name] = {
                    "_value": raw_value
                }

    return ctx
