
from app.ingternal.automation.schemas.automation import AutomationSchema
from typing import List, Callable, Optional, Dict, Tuple, Awaitable, TypeVar
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

time_format = "%H:%M:%S%z"

KEY_TYPE = TypeVar('KEY_TYPE')

class AutomationManagerSchema(BaseModel):
    data: List[AutomationSchema]
    last_tun_time: Optional[datetime] = None

# Класс для хранения и обработки автоматизаций
class AutomationManager:
    def __init__(self, callback: Callable[[AutomationSchema], Awaitable[None]]):
        self.automations: List[AutomationSchema] = []
        self.callback = callback
        self.time_index: Dict[str, AutomationManagerSchema] = {}  # Индекс для быстрого поиска по времени
        self.device_index: Dict[Tuple[str, str], AutomationManagerSchema] = {}  # Индекс для устройств
        self.weekday_time_index: Dict[Tuple[str, str], AutomationManagerSchema] = {}  # Индекс для времени и дня недели
        self.last_run_time: Optional[datetime] = None  # Время последнего выполнения

    def add_automation(self, automation: AutomationSchema):
        if any(a.name == automation.name for a in self.automations):
            return  # Не добавляем дублирующиеся автоматизации
        
        self.automations.append(automation)
        for trigger in automation.trigger:
            if trigger.service == "time":
                time = ""
                time_utc3 = datetime.strptime(trigger.data, time_format)
                time_utc = time_utc3.astimezone(timezone.utc)
                time = time_utc.strftime("%H:%M")
                try:
                    if trigger.option:
                        for day in trigger.option.split(","):
                            key = (day, time)
                            if key not in self.weekday_time_index:
                                self.weekday_time_index[key] = AutomationManagerSchema(data=[])
                            self.weekday_time_index[key].data.append(automation)
                    else:
                        if time not in self.time_index:
                            self.time_index[time] = AutomationManagerSchema(data=[])
                        self.time_index[time].data.append(automation)
                except Exception:
                    continue
            elif trigger.service == "device":
                key = (trigger.object, trigger.data)
                if key not in self.device_index:
                    self.device_index[key] = AutomationManagerSchema(data=[])
                self.device_index[key].data.append(automation)

    def get_automations_with_current_time_trigger(self) -> List[AutomationSchema]:
        current_time = datetime.now().strftime("%H:%M")
        current_weekday = datetime.now().strftime("%A")
        automations = self.time_index.get(current_time, [])
        automations += self.weekday_time_index.get((current_weekday, current_time), [])
        return automations
    
    
    @staticmethod
    def _is_not_activated(key:KEY_TYPE, data:Dict[KEY_TYPE, AutomationManagerSchema], cur_time: datetime):
        if key in data and (data[key].last_tun_time is None or (not data[key].last_tun_time is None and cur_time - data[key].last_tun_time > timedelta(minutes=2))):
            return True
        return False


    async def run_due_automations(self):
        current_time = datetime.now()
        current_time_utc = current_time.astimezone(timezone.utc)
        current_weekday = current_time_utc.strftime("%A")  # Получение текущего дня недели

        if not self.last_run_time:
            self.last_run_time = current_time_utc - timedelta(minutes=1)

        time_to_check = self.last_run_time

        while time_to_check <= current_time_utc:
            # Пропуск, если задержка превышает 5 минут
            if (current_time_utc - time_to_check) > timedelta(minutes=5):
                time_to_check += timedelta(minutes=1)
                continue

            time_str = time_to_check.strftime("%H:%M")
            due_automations = []
            if AutomationManager._is_not_activated(time_str, self.time_index, current_time_utc):
                due_automations += self.time_index[time_str].data
                self.time_index[time_str].last_tun_time = current_time_utc
            if AutomationManager._is_not_activated((current_weekday, time_str), self.weekday_time_index, current_time_utc):
                due_automations += self.weekday_time_index[(current_weekday, time_str)].data
                self.weekday_time_index[(current_weekday, time_str)].last_tun_time = current_time_utc

            for automation in due_automations:
                await self.callback(automation)

            time_to_check += timedelta(minutes=1)

        self.last_run_time = current_time_utc

    async def run_device_triggered_automations(self, device_id: str, field_id: str):
        key = (device_id, field_id)
        automations = self.device_index.get(key, [])

        for automation in automations:
            await self.callback(automation)

    def clear_automations(self):
        self.automations.clear()
        self.time_index.clear()
        self.device_index.clear()
        self.weekday_time_index.clear()
        self.last_run_time = None

    def remove_automation_by_name(self, name: str):
        automations_to_remove = [a for a in self.automations if a.name == name]
        for automation in automations_to_remove:
            self.automations.remove(automation)

            for trigger in automation.trigger:
                if trigger.service == "time":
                    if trigger.object:
                        for day in trigger.object.split(","):
                            key = (day, trigger.data)
                            if key in self.weekday_time_index:
                                self.weekday_time_index[key] = [a for a in self.weekday_time_index[key] if a.name != name]
                                if not self.weekday_time_index[key]:
                                    del self.weekday_time_index[key]
                    else:
                        if trigger.data in self.time_index:
                            self.time_index[trigger.data] = [a for a in self.time_index[trigger.data] if a.name != name]
                            if not self.time_index[trigger.data]:
                                del self.time_index[trigger.data]
                elif trigger.service == "device":
                    key = (trigger.object, trigger.data)
                    if key in self.device_index:
                        self.device_index[key] = [a for a in self.device_index[key] if a.name != name]
                        if not self.device_index[key]:
                            del self.device_index[key]
