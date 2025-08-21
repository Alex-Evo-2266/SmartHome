from app.ingternal.automation.schemas.automation import AutomationSchema, ConditionItemSchema, ActionItemSchema
from app.ingternal.automation.schemas.enums import ConditionType, Operation
from app.ingternal.device.schemas.enums import TypeDeviceField

from app.ingternal.device.exceptions.device import DeviceNotFound, DeviceNotValueFound, DeviceFieldNotFound
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.room.array.RoomArray import RoomArray
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.senderPoll.sender import sender_script
from app.ingternal.room.set_value_room import set_value_room

from app.ingternal.logs import get_automatization
from typing import List

logger = get_automatization.get_logger(__name__)

def _get_device_value(system_name:str, field_id:str):
    dev = DevicesArray.get(system_name)
    device:IDevice = dev.device
    if not device:
        logger.error(f"Device not found: {system_name}")
        raise DeviceNotFound()
    f = device.get_field(field_id)
    value = f.get()
    logger.info(f"Fetched device value: {value} for device {system_name}")
    if value is None:
        logger.error(f"Device value not found: {field_id} in {system_name}")
        raise DeviceNotValueFound()
    if f.get_type() == TypeDeviceField.BINARY:
        if value =='1':
            return "true"
        elif value == '0':
            return "false"
    return value

async def condition_data(service: str, arg: str):
    ar = arg.split('.')
    
    if service == 'device':
        if len(ar) != 2:
            raise Exception("invalid condition")
        object = ar[0]
        data = ar[1]
        return _get_device_value(object, data)
    elif service == 'value':
        if len(ar) != 1:
            raise Exception("invalid condition")
        data = ar[0]
        logger.info(f"Fetched value: {data}")
        return data
    elif service == 'time':
        pass
    elif service == "room":
        logger.info(f"room arg {ar}")
        if len(ar) != 3:
            raise Exception("invalid condition")
        room_name = ar[0]
        object = ar[1]
        data = ar[2]
        value = RoomArray.get_value(room_name, object, data)
        return value
    else:
        logger.warning(f"Unknown service type: {service}")
        return None

async def condition(condition: ConditionItemSchema) -> bool:
    logger.info(f"start condition")
    condition_item1 = await condition_data(condition.arg1_service, condition.arg1)
    condition_item2 = await condition_data(condition.arg2_service, condition.arg2)
    logger.info(f"arg1: {condition_item1}, arg2; {condition_item2}")
    
    if condition.operation == Operation.EQUAL:
        return condition_item1 == condition_item2
    elif condition.operation == Operation.NOT_EQUAL:
        return condition_item1 != condition_item2

    try:
        condition_item1 = int(condition_item1)
        condition_item2 = int(condition_item2)
    except ValueError:
        logger.error("Failed to convert condition values to int")
        return False
    
    logger.info(f"Evaluating condition: {condition.operation} with values {condition_item1} and {condition_item2}")
    
    
    if condition.operation == Operation.MORE:
        return condition_item1 > condition_item2
    elif condition.operation == Operation.MORE_OR_EQUAL:
        return condition_item1 >= condition_item2
    elif condition.operation == Operation.LESS:
        return condition_item1 < condition_item2
    elif condition.operation == Operation.LESS_OR_EQUAL:
        return condition_item1 <= condition_item2
    return False

async def action(data: ActionItemSchema):
    if data.service == "device":
        ar = data.action.split('.')
        if len(ar) != 2:
            raise Exception("invalid action")
        system_name = ar[0]
        field = ar[1]
        device = DevicesArray.get(system_name)
        if not device:
            logger.error(f"Device not found: {system_name}")
            raise DeviceNotFound()
        device_control: IDevice = device.device
        field = device_control.get_field_by_name(field)
        if not field:
            logger.error(f"Device field not found: {field} in {system_name}")
            raise DeviceFieldNotFound()
        
        if field.get_type() == TypeDeviceField.BINARY and data.data == "target":
            value = field.get()
            logger.info(f"Processing binary field: {field}, current value: {value}")
            if value is None and field.get_high() is None:
                device_control.set_value(field.get_id(), "1", script=True)
            elif value is None:
                device_control.set_value(field.get_id(), field.get_high(), script=True)
            elif (field.get_high() is None and value == "0"):
                device_control.set_value(field.get_id(), "1", script=True)
            elif field.get_high() is not None and value == "0":
                device_control.set_value(field.get_id(), field.get_high(), script=True)
            elif (field.get_low() is None and value == "1"):
                device_control.set_value(field.get_id(), "0", script=True)
            elif (field.get_low() is not None and value == "1"):
                device_control.set_value(field.get_id(), field.get_low(), script=True)
        else:
            logger.info(f"Setting field {field} to {data.data}")
            device_control.set_value(field.get_id(), data.data, script=True)
    elif data.service == "script":
        await sender_script.send(data.model_dump())
        logger.info(f"Executing script action: {system_name}")
    elif data.service == "room":
        ar = data.action.split('.')
        if len(ar) != 3:
            raise Exception("invalid action")
        room = ar[0]
        device = ar[1]
        field = ar[2]
        print("p7777", room, device, field, data)
        data_f = RoomArray.get_value_and_type(room, device, field)
        print("p8888",data_f)
        if data_f[1] == TypeDeviceField.BINARY and data.data == "target":
            if data_f[0] == "true":
                print("p9999")
                await set_value_room(room=room, device_type=device, field=field, value="0")
            else:
                await set_value_room(room=room, device_type=device, field=field, value="1")
        else:
            logger.info(f"Setting field {field} to {data.data}")
            await set_value_room(room=room, device_type=device, field=field, value=data.data)
        

async def automation(data: AutomationSchema):
    logger.debug(f"Activate: {data}")
    logger.info(f"Activate: {data.name}, status: {data.is_enabled}")
    if not data.is_enabled:
        logger.info(f"{data.name}, status: {data.is_enabled} skiped")
        return
    conditions = [await condition(condition_schema) for condition_schema in data.condition]
    if len(conditions) == 0 or (data.condition_type == ConditionType.AND and all(conditions)) or (data.condition_type == ConditionType.OR and any(conditions)):
        logger.info("Executing THEN branch actions")
        for action_item in data.then:
            await action(action_item)
    else:
        logger.info("Executing ELSE branch actions")
        for action_item in data.else_branch:
            await action(action_item)
