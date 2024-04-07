from typing import Union
from app.ingternal.automation.schemas.automation_array import ArrayItemAutomationEntity
from app.ingternal.automation.enums import TypeEntityTrigger, TypeEntityInString, Periods
from app.ingternal.automation.models.automation import Automation_trigger
from app.ingternal.automation.utils.automation import remove_options, get_type_entity, automation_entity_time_day_of_week, get_option_command, get_time, get_month, is_time

def convert_automation_entity_device(entity: str)->ArrayItemAutomationEntity | None:
    data = entity.split('.')
    if len(data) >= 2:
        if remove_options(data[0]) == TypeEntityInString.DEVICE and len(data) >= 3:
            return ArrayItemAutomationEntity(type_entity=TypeEntityTrigger.DEVICE, entity_system_name=data[1], entity_field_name=data[2])
        elif not get_type_entity(data[0]):
            return ArrayItemAutomationEntity(type_entity=TypeEntityTrigger.DEVICE, entity_system_name=data[0], entity_field_name=data[1])
    return None

def convert_automation_entity_time(entity: str)->ArrayItemAutomationEntity | None:
    data = entity.split('.')
    if remove_options(data[0]) == TypeEntityInString.EVERY_DAY and len(data) >= 2:
        option = automation_entity_time_day_of_week(get_option_command(data[0]))
        if not option:
            option = "Mon,Tue,Wed,Thu,Fri,Sat,Sun"
        time = get_time(data[1])
        if not time:
            return None
        return ArrayItemAutomationEntity(type_entity=TypeEntityTrigger.TIME, period=Periods.EVERY_DAY, day=option, hour=time[0], minute=time[1])
    elif remove_options(data[0]) == TypeEntityInString.EVERY_HOUR and len(data) >= 2:
        return ArrayItemAutomationEntity(type_entity=TypeEntityTrigger.TIME, period=Periods.EVERY_HOUR, minute=data[1])
    elif remove_options(data[0]) == TypeEntityInString.EVERY_MONTH and len(data) >= 4:
        time = get_time(data[2])
        if not time:
            return None
        return ArrayItemAutomationEntity(type_entity=TypeEntityTrigger.TIME, period=Periods.EVERY_MONTH, day=data[1], hour=data[2], minute=data[3])
    elif remove_options(data[0]) == TypeEntityInString.EVERY_YEAR and len(data) >= 4:
        time = get_time(data[3])
        month = get_month(data[1])
        if not time or not month:
            return None
        return ArrayItemAutomationEntity(type_entity=TypeEntityTrigger.TIME, period=Periods.EVERY_YEAR, month=month, day=data[1], hour=time[0], minute=time[1])
    elif not get_type_entity(data[0]) and is_time(data[0]) and len(data) == 1:
        time = data[0].split(':')
        print(time)
        return ArrayItemAutomationEntity(type_entity=TypeEntityTrigger.TIME, period=Periods.EVERY_DAY, day="Mon,Tue,Wed,Thu,Fri,Sat,Sun", hour=time[0], minute=time[1])
    return None


def convert_automation_entity(entity: Automation_trigger)->Union[ArrayItemAutomationEntity, None]:
    if entity.type_entity == TypeEntityTrigger.DEVICE:
        entity_conver = convert_automation_entity_device(entity.entity)
    elif entity.type_entity == TypeEntityTrigger.TIME:
        entity_conver = convert_automation_entity_time(entity.entity)
    return entity_conver