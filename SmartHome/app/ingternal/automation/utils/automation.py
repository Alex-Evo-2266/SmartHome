import re
from app.ingternal.automation.enums import TypeEntityInString, TypeEntityTrigger, TIME_DAYS, TIME_MONTH, TypeEntityCondition, TypeEntityAction

def is_time(str:str):
    return bool(re.match('\d{2}:\d{2}', str))

def get_time(str:str):
    if is_time(str):
        data = str.split(':')
        return (data[0], data[1])
    return None

def get_type_entity(str:str):
    if str == TypeEntityInString.DEVICE:
        return TypeEntityTrigger.DEVICE
    if str == TypeEntityInString.SERVICE:
        return TypeEntityTrigger.SERVICE
    if str == TypeEntityInString.EVERY_DAY or str == TypeEntityInString.EVERY_HOUR or str == TypeEntityInString.EVERY_MONTH or str == TypeEntityInString.EVERY_YEAR:
        return TypeEntityTrigger.TIME
    return None

def get_type_condition(str:str):
    if str == TypeEntityCondition.DEVICE:
        return TypeEntityCondition.DEVICE
    if str == TypeEntityCondition.SERVICE:
        return TypeEntityCondition.SERVICE
    if str == TypeEntityCondition.DATE:
        return TypeEntityCondition.DATE
    if str == TypeEntityCondition.TIME:
        return TypeEntityCondition.TIME
    return None

def get_type_action(str:str):
    if str == TypeEntityAction.DEVICE:
        return TypeEntityAction.DEVICE
    if str == TypeEntityAction.SERVICE:
        return TypeEntityAction.SERVICE
    if str == TypeEntityAction.DELAY:
        return TypeEntityAction.DELAY
    if str == TypeEntityAction.SCRIPT:
        return TypeEntityAction.SCRIPT
    return None

def get_option_command(command: str):
    data = command.split('[')
    if len(data) < 2: 
        return None
    option = data[1]
    option = option.split(']')[0]
    return option

def remove_options(command: str):
    data = command.split('[')
    return data[0]

def automation_entity_time_day_of_week(str:str | None):
    if not str:
        return None
    data = [x.strip() for x in str.split(',')]
    new_data = []
    for item in data:
        flag = False
        for day in TIME_DAYS:
            if day.value.lower() == item.lower():
                flag = True
        if flag:
            new_data.append(item)
    if len(new_data) == 0:
        return None
    return ",".join(new_data)

def get_month(str:str):
    for month in TIME_MONTH:
        if month.name.lower() == str.lower() or month.value.lower() == str.lower():
            return month
    return None


def get_index_weekday(day: TIME_DAYS):
    for idx, x in enumerate(TIME_DAYS):
        if day == x:
            return idx
        
def get_index_month(day: TIME_MONTH):
    for idx, x in enumerate(TIME_MONTH):
        if day == x:
            return idx + 1