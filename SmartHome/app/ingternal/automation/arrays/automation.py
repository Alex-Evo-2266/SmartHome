from app.ingternal.automation.schemas.automation import AutomationSchema, TriggerItemSchema
from typing import List, Callable, Optional, Dict, Tuple, Awaitable, TypeVar, Set
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from app.ingternal.room.cache.all_rooms import get_cached_room_data
from app.ingternal.room.schemas.room import RoomDevicesRaw
from app.ingternal.logs import MyLogger
from app.ingternal.modules.struct.DeviceStatusStore import DevicePatch
from app.ingternal.modules.struct.RoomStateStore import RoomDevicePatch

# Настройка логирования
logger = MyLogger().get_logger(__name__)

# Константы для форматов времени
TIME_FORMAT = "%H:%M:%S%z"  # Формат времени с часовым поясом
UTC_TIME_FORMAT = "%H:%M"    # Упрощенный формат UTC времени

# Общий тип для ключей индексов
KEY_TYPE = TypeVar('KEY_TYPE')

class AutomationManagerSchema(BaseModel):
    """Схема для хранения списка автоматизаций и времени последнего запуска"""
    data: List[str]
    last_run_time: Optional[datetime] = None


class AutomationManager:
    """Основной класс для управления автоматизациями"""

    def __init__(self, callback: Callable[[AutomationSchema], Awaitable[None]]):
        """
        Инициализация менеджера автоматизаций
        
        :param callback: Асинхронная функция для выполнения автоматизаций
        """
        self.automations: Dict[str, AutomationSchema] = {}
        self.callback = callback
        self.time_index: Dict[str, AutomationManagerSchema] = {}
        self.device_index: Dict[Tuple[str, str], AutomationManagerSchema] = {}
        self.room_index: Dict[Tuple[str, str, str], AutomationManagerSchema] = {}
        self.weekday_time_index: Dict[Tuple[str, str], AutomationManagerSchema] = {}
        self.last_run_time: Optional[datetime] = None
        self._processed_automations: Set[str] = set()

        self._running_rooms = set()  # во время инициализации

    def add_automation(self, automation: AutomationSchema) -> bool:
        """
        Добавляет новую автоматизацию в менеджер
        
        :param automation: Автоматизация для добавления
        :return: True если добавлено успешно, False если автоматизация уже существует
        """
        if any(a == automation.name for a in self.automations):
            logger.warning(f"Автоматизация с именем '{automation.name}' уже существует")
            return False

        self.automations[automation.name] = automation
        
        for trigger in automation.trigger:
            try:
                if trigger.service == "time":
                    self._process_time_trigger(automation.name, trigger)
                elif trigger.service == "device":
                    self._process_device_trigger(automation.name, trigger)
                elif trigger.service == "room":
                    d = trigger.trigger.split(".")
                    if len(d) != 3:
                        return
                    key = (d[0], d[1], d[2])
                    if key not in self.room_index:
                        self.room_index[key] = AutomationManagerSchema(data=[])
                    self.room_index[key].data.append(automation.name)
            except Exception as e:
                logger.error(f"Ошибка обработки триггера для автоматизации '{automation.name}': {e}")
                continue
                
        return True

    def _process_time_trigger(self, automation_name: str, trigger:TriggerItemSchema) -> None:
        """Обрабатывает временной триггер и добавляет в соответствующие индексы"""
        try:
            time_utc = datetime.strptime(trigger.trigger, TIME_FORMAT).astimezone(timezone.utc)
            time_str = time_utc.strftime(UTC_TIME_FORMAT)
            
            if trigger.option:  # Триггер с указанием дней недели
                for day in trigger.option.split(","):
                    key = (day.strip(), time_str)
                    if key not in self.weekday_time_index:
                        self.weekday_time_index[key] = AutomationManagerSchema(data=[])
                    self.weekday_time_index[key].data.append(automation_name)
            else:  # Ежедневный триггер
                if time_str not in self.time_index:
                    self.time_index[time_str] = AutomationManagerSchema(data=[])
                self.time_index[time_str].data.append(automation_name)
        except ValueError as e:
            logger.error(f"Неверный формат времени в автоматизации '{automation_name}': {e}")

    def _process_device_trigger(self, automation_name: str, trigger:TriggerItemSchema) -> None:
        """Обрабатывает триггер устройства и добавляет в индекс устройств"""
        if trigger.service != "device":
            return
        d = trigger.trigger.split(".")
        if len(d) != 2:
            return
        key = (d[0], d[1])
        if key not in self.device_index:
            self.device_index[key] = AutomationManagerSchema(data=[])
        self.device_index[key].data.append(automation_name)

    async def run_due_automations(self) -> None:
        """Запускает автоматизации, для которых наступило время выполнения"""
        current_time = datetime.now(timezone.utc)
        current_weekday = current_time.strftime("%a")

        if not self.last_run_time:
            self.last_run_time = current_time - timedelta(minutes=1)

        time_to_check = self.last_run_time
        self._processed_automations.clear()

        while time_to_check <= current_time:
            # Пропускаем большие промежутки (более 5 минут)
            if (current_time - time_to_check) > timedelta(minutes=5):
                time_to_check += timedelta(minutes=1)
                continue

            time_str = time_to_check.strftime(UTC_TIME_FORMAT)
            due_automations = self._get_due_automations(time_str, current_weekday, current_time)
            
            for automation_name in due_automations:
                if automation_name not in self._processed_automations and automation_name in self.automations:
                    try:
                        await self.callback(self.automations[automation_name])
                        self._processed_automations.add(automation_name)
                    except Exception as e:
                        logger.error(f"Ошибка выполнения автоматизации '{automation_name}': {e}")

            time_to_check += timedelta(minutes=1)

        self.last_run_time = current_time

    def _get_due_automations(self, time_str: str, current_weekday: str, current_time: datetime) -> List[str]:
        """Возвращает список автоматизаций, которые должны быть выполнены в указанное время"""
        due_automations = []
        
        # Проверяем ежедневные триггеры
        if self._should_trigger(time_str, self.time_index, current_time):
            due_automations.extend(self.time_index[time_str].data)
            self.time_index[time_str].last_run_time = current_time
        
        # Проверяем триггеры по дням недели
        weekday_key = (current_weekday, time_str)
        if self._should_trigger(weekday_key, self.weekday_time_index, current_time):
            due_automations.extend(self.weekday_time_index[weekday_key].data)
            self.weekday_time_index[weekday_key].last_run_time = current_time
            
        return due_automations

    @staticmethod
    def _should_trigger(key: KEY_TYPE, index: Dict[KEY_TYPE, AutomationManagerSchema], current_time: datetime) -> bool:
        """Определяет, нужно ли запускать автоматизацию"""
        if key not in index:
            return False
            
        manager_schema = index[key]
        return (
            manager_schema.last_run_time is None or
            (current_time - manager_schema.last_run_time) > timedelta(minutes=2)
        )

    async def _run_automation_safe(self, automation_name: str):
        automation = self.automations.get(automation_name)
        if not automation:
            return

        try:
            await self.callback(automation)
        except Exception as e:
            logger.error(
                "Automation '%s' failed: %s",
                automation_name,
                e,
            )

    
    async def on_device_patch(self, patch: DevicePatch) -> None:
        logger.debug(f"Automation on_device_patch {patch} {self.device_index}")
        for field_name in patch.changes.keys():
            key = (patch.system_name, field_name)

            if key not in self.device_index:
                continue

            for automation_name in self.device_index[key].data:
                await self._run_automation_safe(automation_name)
    
    async def on_room_patch(self, patch: RoomDevicePatch) -> None:
        logger.debug(f"Automation on_room_patch {patch}")
        for field_name in patch.changes.keys():
            key = (patch.room, patch.type_name, field_name)

            if key not in self.room_index:
                continue

            if key in self._running_rooms:
                logger.warning(f"Automation already running for {key}")
                return

            self._running_rooms.add(key)
            try:
                for automation_name in self.room_index[key].data:
                    await self._run_automation_safe(automation_name)
            finally:
                self._running_rooms.remove(key)



    async def run_device_triggered_automations(self, device_id: str, field_name: str) -> None:
        """legasy Запускает автоматизации, связанные с указанным устройством"""
        key = (device_id, field_name)
        if key not in self.device_index:
            return
        
        for automation_name in self.device_index[key].data:
            try:
                await self.callback(self.automations[automation_name])
            except Exception as e:
                logger.error(f"Ошибка выполнения автоматизации '{automation_name}' по триггеру устройства: {e}")
        
    async def run_room_triggered_automations(self, device_id: str,field_id:str, room_name:str) -> None:
        """legasy"""
        rooms:List[RoomDevicesRaw] = await get_cached_room_data()
        try:
            room = next(r for r in rooms if r.name_room == room_name)
            for type_dev, d in room.device_room.items():
                for field_dev, f in d.fields.items():
                    for dev in f.devices:
                        if dev.system_name == device_id and dev.id_field_device == field_id:
                            key = (room.name_room, type_dev, field_dev)
                            if key not in self.room_index:
                                return
                            if key in self._running_rooms:
                                logger.warning(f"Aвтоматизации выполняется '{key}'")
                                return
                            self._running_rooms.add(key)
                            try:
                                for automation_name in self.room_index[key].data:
                                    try:
                                        await self.callback(self.automations[automation_name])
                                    except Exception as e:
                                        logger.error(f"Ошибка выполнения автоматизации '{automation_name}' по триггеру комнаты: {e}")
                            finally:
                                self._running_rooms.remove(key)
        except Exception as e:
            logger.warning(f"error trigger room: {room_name} - {e}")

    def clear_automations(self) -> None:
        """Очищает все автоматизации и сбрасывает состояние менеджера"""
        self.automations.clear()
        self.time_index.clear()
        self.device_index.clear()
        self.weekday_time_index.clear()
        self.last_run_time = None
        self._processed_automations.clear()

    def remove_automation_by_name(self, name: str) -> bool:
        """
        Удаляет автоматизацию по имени
        
        :param name: Имя автоматизации для удаления
        :return: True если автоматизация была найдена и удалена, False если не найдена
        """
        automations_to_remove = [a for a in self.automations if a.name == name]
        if not automations_to_remove:
            return False
            
        for automation in automations_to_remove:
            self.automations.pop(automation)
            self._remove_automation_from_indexes(automation)
            
        return True

    def _remove_automation_from_indexes(self, automation: AutomationSchema) -> None:
        """Удаляет автоматизацию из всех индексов"""
        for trigger in automation.trigger:
            if trigger.service == "time":
                self._remove_from_time_indexes(automation.name, trigger)
            elif trigger.service == "device":
                self._remove_from_device_index(automation.name, trigger)
            elif trigger.service == "room":
                self._remove_from_room_index(automation.name, trigger)

    def _remove_from_time_indexes(self, automation_name: str, trigger: TriggerItemSchema) -> None:
        """Удаляет автоматизацию из временных индексов"""
        try:
            time_utc = datetime.strptime(trigger.trigger, TIME_FORMAT).astimezone(timezone.utc)
            time_str = time_utc.strftime(UTC_TIME_FORMAT)
            
            if trigger.option:
                for day in trigger.option.split(","):
                    key = (day.strip(), time_str)
                    self._remove_from_index(automation_name, key, self.weekday_time_index)
            else:
                self._remove_from_index(automation_name, time_str, self.time_index)
        except ValueError:
            pass

    def _remove_from_device_index(self, automation_name: str, trigger: TriggerItemSchema) -> None:
        """Удаляет автоматизацию из индекса устройств"""
        d = trigger.trigger.split(".")
        if len(d) != 2:
            return
        key = (d[0], d[1])
        self._remove_from_index(automation_name, key, self.device_index)

    def _remove_from_room_index(self, automation_name: str, trigger: TriggerItemSchema) -> None:
        """Удаляет автоматизацию из индекса устройств"""
        d = trigger.trigger.split(".")
        if len(d) != 3:
            return
        key = (d[0], d[1], d[2])
        self._remove_from_index(automation_name, key, self.room_index)

    @staticmethod
    def _remove_from_index(
        automation_name: str,
        key: KEY_TYPE,
        index: Dict[KEY_TYPE, AutomationManagerSchema]
    ) -> None:
        """Удаляет автоматизацию из конкретного индекса"""
        if key in index:
            index[key].data = [a for a in index[key].data if a != automation_name]
            if not index[key].data:
                del index[key]

    def get_automation_count(self) -> Tuple[int, int, int, int, int]:
        """
        Возвращает статистику по автоматизациям
        
        :return: Кортеж с количеством: 
                 (всего автоматизаций, временных триггеров, триггеров устройств, триггеров по дням недели)
        """
        time_count = sum(len(schema.data) for schema in self.time_index.values())
        device_count = sum(len(schema.data) for schema in self.device_index.values())
        room_count = sum(len(schema.data) for schema in self.room_index.values())
        weekday_count = sum(len(schema.data) for schema in self.weekday_time_index.values())
        return (len(self.automations.keys()), time_count, device_count, weekday_count, room_count)