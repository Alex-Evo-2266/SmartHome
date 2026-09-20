from app.schemas.automation.automation_v4 import RoomTrigger, AutomationSchema, WeeklyTimeTrigger, MonthlyTimeTrigger, OnceTimeTrigger, DeviceTrigger
from typing import Callable, Optional, Awaitable, TypeVar
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, Field
from app.core.state.event import DevicePatch, RoomDevicePatch
from datetime import time

from app.pkg.logger import MyLogger

# Настройка логирования
logger = MyLogger().get_logger(__name__)

# Константы для форматов времени
TIME_FORMAT = "%H:%M:%S%z"  # Формат времени с часовым поясом
UTC_TIME_FORMAT = "%H:%M"    # Упрощенный формат UTC времени

# Общий тип для ключей индексов
KEY_TYPE = TypeVar('KEY_TYPE')

class IndexBucket(BaseModel):
    """Схема для хранения списка автоматизаций и времени последнего запуска"""
    data: list[str] = Field(default_factory=list)
    last_run_time: Optional[datetime] = None


class AutomationManager_V4:
    """Основной класс для управления автоматизациями"""

    def __init__(self, callback: Optional[Callable[[AutomationSchema], Awaitable[None]]] = None):
        """
        Инициализация менеджера автоматизаций
        
        :param callback: Асинхронная функция для выполнения автоматизаций
        """
        self.automations: dict[str, AutomationSchema] = {}
        self.callback = callback
        # (weekday 0..6, "HH:MM") → bucket
        self.weekly: dict[tuple[int, str], IndexBucket] = {}
        # (day_of_month 1..31 или -1, "HH:MM") → bucket
        self.monthly: dict[tuple[int, str], IndexBucket] = {}
        # ISO "YYYY-MM-DDTHH:MM±HH:MM" → bucket
        self.once: dict[str, IndexBucket] = {}
        # интервалы — список, т.к. у них нет фиксированного времени
        # self.interval: list[tuple[str, int, int]] = {}

        self.device_index: dict[tuple[str, str], IndexBucket] = {}
        self.room_index: dict[tuple[str, str, str], IndexBucket] = {}

        self.last_run_time: Optional[datetime] = None
        self._processed_automations: set[str] = set()
        self._running_automations: set[str] = set()

    def register_collback(self, callback: Callable[[AutomationSchema], Awaitable[None]]):
        self.callback = callback

    @staticmethod
    def _remove_from_bucket(index: dict, key, automation_id: str) -> None:
        """Убирает id из bucket-а, чистит пустой ключ."""
        bucket = index.get(key)
        if bucket is None:
            return

        bucket.data = [i for i in bucket.data if i != automation_id]

        # Если bucket опустел — удаляем ключ, чтобы не рос мусор
        if not bucket.data:
            index.pop(key, None)
        
#=====================================add time=============================================

    def index_time_trigger(
        self,
        id: str,
        trigger: WeeklyTimeTrigger,
    ) -> None:
        """Регистрирует сценарий во всех нужных bucket-ах."""
        minute_key = self._normalize_time(trigger.at)   # "22:30"
        for weekday in trigger.weekdays:
            key = (weekday, minute_key)
            bucket = self.weekly.setdefault(key, IndexBucket())
            if id not in bucket.data:
                bucket.data.append(id)

    def index_monthly_trigger(
        self,
        id: str,
        trigger: MonthlyTimeTrigger,
    ) -> None:
        minute_key = self._normalize_time(trigger.at)
        for day in trigger.month_days:
            key = (day, minute_key)
            bucket = self.monthly.setdefault(key, IndexBucket())
            if id not in bucket.data:
                bucket.data.append(id)

    def index_once_trigger(
        self,
        id: str,
        trigger: OnceTimeTrigger,
    ) -> None:
        moment_key = self._normalize_moment(trigger.run_at)   # "2026-01-15T22:30"
        bucket = self.once.setdefault(moment_key, IndexBucket())
        bucket.data.append(id)

    @staticmethod
    def _normalize_time(at: str) -> str:
        """'22:30' или '22:30:00' → '22:30'."""
        t = time.fromisoformat(at)
        return t.strftime("%H:%M")

    @staticmethod
    def _normalize_moment(run_at: str) -> str:
        """ISO 8601 → 'YYYY-MM-DDTHH:MM' (без секунд и таймзоны)."""
        dt = datetime.fromisoformat(run_at).astimezone(timezone.utc)
        return dt.strftime("%Y-%m-%dT%H:%M")

# ===================================== run time=============================================

    # def _get_due_automations(self, now: datetime) -> list[str]:
    #     """Возвращает список автоматизаций, которые должны быть выполнены в указанное время"""
    #     due_automations = []
    #     minute_key = now.strftime("%H:%M")
        
    #     # WEEKLY (включает "каждый день")
    #     weekday = now.weekday()
    #     key = (weekday, minute_key)
    #     bucket = self.weekly.get(key)
    #     if bucket:
    #         due_automations.extend(self.weekly[key].data)
    #         self.weekly[key].last_run_time = now

    #     # MONTHLY
    #     month_day = now.day
    #     key = (month_day, minute_key)
    #     bucket = self.monthly.get(key)
    #     if bucket:
    #         due_automations.extend(self.monthly[key].data)
    #         self.monthly[key].last_run_time = now

    #     # ONCE
    #     moment_key = now.strftime("%Y-%m-%dT%H:%M")
    #     key = moment_key
    #     bucket = self.once.get(key)
    #     if bucket:
    #         due_automations.extend(self.once[key].data)
    #         self.once[key].last_run_time = now

    #     # INTERVAL
    #     # for name, trigger_idx, interval_sec in list(self.interval):
    #     #     last = self.scenario_last_run.get(name)
    #     #     if last is None or (now - last).total_seconds() >= interval_sec:
    #     #         await self._run_automation_safe(name)
        
    #     return due_automations

    def _get_due_automations(self, now: datetime) -> list[str]:
        due_automations = []
        minute_key = now.strftime("%H:%M")

        def _grab(index, key) -> list[str]:
            bucket = index.get(key)
            if not bucket:
                return []
            # Уже запускали в этом же «логическом моменте»?
            if bucket.last_run_time is not None and \
            abs((now - bucket.last_run_time).total_seconds()) < 60:
                return []
            bucket.last_run_time = now
            return list(bucket.data)

        due_automations.extend(_grab(self.weekly, (now.weekday(), minute_key)))
        due_automations.extend(_grab(self.monthly, (now.day, minute_key)))
        due_automations.extend(_grab(self.once, now.strftime("%Y-%m-%dT%H:%M")))

        return due_automations

    async def run_due_automations(self) -> None:
        now = datetime.now(timezone.utc)

        if not self.last_run_time:
            self.last_run_time = now - timedelta(minutes=1)

        time_to_check = self.last_run_time
        self._processed_automations.clear()

        while time_to_check <= now:
            # Пропускаем большие промежутки (более 5 минут)
            if (now - time_to_check) > timedelta(minutes=5):
                time_to_check += timedelta(minutes=1)
                continue

            due_automations = self._get_due_automations(time_to_check)

            for automation_id in due_automations:
                if automation_id not in self._processed_automations and automation_id in self.automations and self.callback:
                    try:
                        await self.callback(self.automations[automation_id])
                        self._processed_automations.add(automation_id)
                    except Exception as e:
                        logger.error(f"Ошибка выполнения автоматизации '{automation_id}': {e}")

            time_to_check += timedelta(minutes=1)

        self.last_run_time = now

# ===================================== remove time=============================================

    def _unindex_weekly(self, automation_id: str, trigger: WeeklyTimeTrigger) -> None:
        minute_key = self._normalize_time(trigger.at)
        for weekday in trigger.weekdays:
            self._remove_from_bucket(self.weekly, (weekday, minute_key), automation_id)

    def _unindex_monthly(self, automation_id: str, trigger: MonthlyTimeTrigger) -> None:
        minute_key = self._normalize_time(trigger.at)
        for day in trigger.month_days:
            self._remove_from_bucket(self.monthly, (day, minute_key), automation_id)

    def _unindex_once(self, automation_id: str, trigger: OnceTimeTrigger) -> None:
        moment_key = self._normalize_moment(trigger.run_at)
        self._remove_from_bucket(self.once, moment_key, automation_id)

#============================================device==================================================

    def index_device_trigger(self, id: str, trigger:DeviceTrigger) -> None:
        """Обрабатывает триггер устройства и добавляет в индекс"""
        key = (trigger.device, trigger.field)
        if key not in self.device_index:
            self.device_index[key] = IndexBucket(data=[])
        self.device_index[key].data.append(id)

    def _unindex_device(self, automation_id: str, trigger: DeviceTrigger) -> None:
        key = (trigger.device, trigger.field)
        self._remove_from_bucket(self.device_index, key, automation_id)

    async def on_device_patch(self, patch: DevicePatch) -> None:
        logger.debug(f"Automation on_device_patch {patch} {self.device_index}")

        candidates: set[str] = set()

        for field_name in patch.changes.keys():
            key = (patch.system_name, field_name)
            bucket = self.device_index.get(key)
            if bucket:
                candidates.update(bucket.data)

        if not candidates:
            return

        for automation_id in candidates:
            automation = self.automations.get(automation_id)
            if automation is None or automation_id in self._running_automations:
                continue

            # сюда проверку на условие в будущем

            self._running_automations.add(automation_id)

            try:
                if(self.callback):
                    await self.callback(automation)
            except Exception as e:
                logger.error(
                    "Automation '%s' - '%s' failed: %s",
                    automation.name,
                    automation.id,
                    e,
                )
            finally:
                self._running_automations.discard(automation_id)

#======================================room==========================================

    def index_room_trigger(self, id: str, trigger:RoomTrigger) -> None:
        """Обрабатывает триггер комнаты и добавляет в индекс"""
        key = (trigger.room, trigger.device_type, trigger.field)
        bucket = self.room_index.setdefault(key, IndexBucket())
        if id not in bucket.data:
            bucket.data.append(id)

    def _unindex_room(self, automation_id: str, trigger: RoomTrigger) -> None:
        key = (trigger.room, trigger.device_type, trigger.field)
        self._remove_from_bucket(self.room_index, key, automation_id)

    async def on_room_patch(self, patch: RoomDevicePatch) -> None:
        logger.debug(f"Automation on_room_patch {patch}")

        candidates: set[str] = set()

        for field_name in patch.changes.keys():
            key = (patch.room, patch.type_name, field_name)
            bucket = self.room_index.get(key)
            if bucket:
                candidates.update(bucket.data)

        if not candidates:
            return

        for automation_id in candidates:
            automation = self.automations.get(automation_id)
            if automation is None or automation_id in self._running_automations:
                continue

            # сюда проверку на условие в будущем

            self._running_automations.add(automation_id)

            try:
                if(self.callback):
                    await self.callback(automation)
            except Exception as e:
                logger.error(
                    "Automation '%s' - '%s' failed: %s",
                    automation.name,
                    automation.id,
                    e,
                )
            finally:
                self._running_automations.discard(automation_id)



#================================================================================================

    def add_automation(self, automation: AutomationSchema):
        """
        Добавляет новую автоматизацию в менеджер
        
        :param automation: Автоматизация для добавления
        :return: True если добавлено успешно, False если автоматизация уже существует
        """
        if automation.id in self.automations:
            logger.warning(f"Автоматизация с именем '{automation.name}'-'{automation.id}' уже существует")
            return False

        self.automations[automation.id] = automation

        for trigger in automation.trigger:

            if(trigger.type == 'time'):
                if(trigger.kind == 'weekly'):
                    self.index_time_trigger(automation.id, trigger)
                if(trigger.kind == 'monthly'):
                    self.index_monthly_trigger(automation.id, trigger)
                if(trigger.kind == 'once'):
                    self.index_once_trigger(automation.id, trigger)
            if(trigger.type == 'device'):
                self.index_device_trigger(automation.id, trigger)
            if(trigger.type == 'room'):
                self.index_room_trigger(automation.id, trigger)

        return True

    def remove_automation(self, automation_id: str) -> bool:
        """
        Удаляет автоматизацию из менеджера и всех индексов.

        :param automation_id: ID автоматизации
        :return: True если удалено, False если не найдено
        """
        automation = self.automations.get(automation_id)
        if automation is None:
            logger.warning(f"Автоматизация '{automation_id}' не найдена")
            return False

        # Снимаем все триггеры с индексов
        for trigger in automation.trigger:
            if trigger.type == "time":
                if trigger.kind == "weekly":
                    self._unindex_weekly(automation_id, trigger)
                elif trigger.kind == "monthly":
                    self._unindex_monthly(automation_id, trigger)
                elif trigger.kind == "once":
                    self._unindex_once(automation_id, trigger)
            elif trigger.type == 'device':
                self._unindex_device(automation_id, trigger)
            elif trigger.type == 'room':
                self._unindex_room(automation_id, trigger)

        # Убираем из основного словаря
        del self.automations[automation_id]

        # Чистим служебные структуры
        self._processed_automations.discard(automation_id)

        logger.info(f"Автоматизация '{automation_id}' удалена")
        return True

    def clear_automations(self) -> None:
        """Очищает все автоматизации и сбрасывает состояние менеджера"""
        self.automations.clear()
        self.weekly.clear()
        self.monthly.clear()
        self.once.clear()
        self.device_index.clear()
        self.room_index.clear()
        self._running_automations.clear()
        self.last_run_time = None
        self._processed_automations.clear()

