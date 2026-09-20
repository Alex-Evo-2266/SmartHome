# app/core/automation/path_resolver.py
"""
Резолвер путей PathArg → рантайм-значение.

Поддерживаемые формы:
  device.<system_name>.<field_id>   — значение поля устройства
  system.<field>                    — системные данные (time, date, weekday, ...)
  variable.<name>                   — пользовательские переменные (заглушка)

Если путь неизвестен — бросается ValueError, чтобы сценарий не «продолжался
с None» и ошибка была видна на этапе запуска, а не через 3 шага.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Final

from app.schemas.automation.automation_v4 import PathArg
from app.schemas.device.device import DeviceSerializeFieldSchema, TypeDeviceField
from app.exceptions.device import (
    DeviceNotFound,
    DeviceNotValueFound,
    DeviceFieldNotFound,
)
from app.core.state.get_store import get_container
from app.pkg.logger import get_automatization

logger = get_automatization.get_logger(__name__)


# ============================================================
# BINARY нормализация
# ============================================================

_TRUE_VALUES: Final = frozenset({
    True, 1, "1", "true", "True", "TRUE", "on", "ON", "yes", "YES",
})
_FALSE_VALUES: Final = frozenset({
    False, 0, "0", "false", "False", "FALSE", "off", "OFF", "no", "NO",
})


def _normalize_binary(value: Any) -> bool:
    """
    Приводит значение BINARY-поля к bool.

    Принимает:
      - bool (True / False)
      - int (0 / 1)
      - str ("1"/"0"/"true"/"false"/"on"/"off"/...)
      - bytes (b"1", b"true", ...)

    Иначе — ValueError.
    """
    if isinstance(value, bytes):
        value = value.decode("utf-8", errors="ignore")

    if isinstance(value, str):
        v = value.strip()
        # точное сравнение сначала — чтобы "1" != "10"
        if v in _TRUE_VALUES:
            return True
        if v in _FALSE_VALUES:
            return False

    if value in _TRUE_VALUES:
        return True
    if value in _FALSE_VALUES:
        return False

    raise ValueError(f"Не удалось нормализовать BINARY-значение: {value!r}")


# ============================================================
# Числа
# ============================================================

def _normalize_number(value: Any) -> int | float | Any:
    """
    Приводит значение NUMBER-поля к int или float.

    Если значение не парсится — возвращает как есть (логируется warning),
    чтобы не падать на «сырых» данных из MQTT.
    """
    if isinstance(value, bool):
        # bool — это не число в контексте устройства
        return int(value)

    if isinstance(value, (int, float)):
        return value

    if isinstance(value, bytes):
        value = value.decode("utf-8", errors="ignore")

    if isinstance(value, str):
        s = value.strip()
        try:
            # "25" → int, "25.5" → float
            if "." in s or "e" in s.lower():
                return float(s)
            return int(s)
        except (ValueError, TypeError):
            logger.warning("NUMBER-поле вернуло не-число: %r", value)
            return value
            # raise ValueError("NUMBER-поле вернуло не-число: %r", value)

    logger.warning("NUMBER-поле вернуло не-число: %r", value)
    return value
    # raise ValueError("NUMBER-поле вернуло не-число: %r", value)


# ============================================================
# Чтение из device_store
# ============================================================

def _fetch_device_field(
    system_name: str,
    field_id: str,
) -> tuple[Any, DeviceSerializeFieldSchema]:
    """
    Возвращает (значение, описание поля) или бросает:
      - DeviceNotFound     — устройства нет в сторе
      - DeviceFieldNotFound — поля нет в описании устройства

    Значение может быть None — это валидное состояние стора,
    проверка на None делается на уровне выше.
    """
    store = get_container().device_store
    snapshot = store.get_snapshot(system_name)

    if snapshot is None:
        logger.error("Device not found: %s", system_name)
        raise DeviceNotFound()

    fields = snapshot.description.fields or []
    field = next((f for f in fields if f.id == field_id), None)

    if field is None:
        logger.error("Field not found: %s in %s", field_id, system_name)
        raise DeviceFieldNotFound()

    value = snapshot.state.get(field.name)
    return value, field


def _resolve_device(system_name: str, field_id: str) -> Any:
    """
    Читает значение поля устройства и нормализует по типу поля.
    """
    value, field = _fetch_device_field(system_name, field_id)

    logger.debug(
        "resolve device.%s.%s → %r (type=%s)",
        system_name, field_id, value, field.type,
    )

    if value is None:
        logger.error("Device value is None: %s in %s", field_id, system_name)
        raise DeviceNotValueFound()

    if field.type == TypeDeviceField.BINARY:
        return _normalize_binary(value)

    if field.type == TypeDeviceField.NUMBER:
        return _normalize_number(value)

    if field.type == TypeDeviceField.COUNTER:
        return _normalize_number(value)

    # TEXT / ENUM / BASE — как есть
    return value


# ============================================================
# System-пути
# ============================================================

def _resolve_system(field: str) -> Any:
    """
    Системные данные. Все возвращаются как сериализуемые примитивы,
    чтобы их можно было сравнивать с литералами в выражениях.
    """
    now = datetime.now(timezone.utc)

    if field == "time":
        # "22:30:00" — сравнимо с time-литералами
        return now.strftime("%H:%M:%S")

    if field == "hour_minute":
        # "22:30" — для прямого сравнения с "22:30"
        return now.strftime("%H:%M")

    if field == "date":
        # "2026-01-15"
        return now.date().isoformat()

    if field == "weekday":
        # 0..6, Пн=0 — совпадает с Weekday enum
        return now.weekday()

    if field == "timestamp":
        # Unix-секунды (UTC)
        return int(now.timestamp())

    if field == "utc_offset":
        # смещение в секундах (+10800 для MSK)
        offset = now.utcoffset()
        return int(offset.total_seconds()) if offset else 0

    raise ValueError(f"Неизвестное системное поле: system.{field}")


# ============================================================
# Variable-пути (заглушка)
# ============================================================

def _resolve_variable(name: str) -> Any:
    """
    Пользовательские переменные. Пока не реализовано —
    бросаем NotImplementedError, чтобы не возвращать None молча.
    """
    raise NotImplementedError(
        f"variable-путь пока не реализован: variable.{name}"
    )


# ============================================================
# Публичная точка входа
# ============================================================

def resolve_path(arg: PathArg) -> Any:
    """
    Возвращает значение по PathArg.

    Формы:
      device.<system_name>.<field_id>   — значение поля устройства
      system.<field>                    — системные данные
      variable.<name>                   — пользовательские переменные (TBD)

    Бросает:
      ValueError          — неизвестный префикс или некорректный путь
      DeviceNotFound      — устройства нет в сторе
      DeviceFieldNotFound — поля нет в описании устройства
      DeviceNotValueFound — значение поля = None
    """
    path = arg.path

    # ---- device.<system_name>.<field_id> ----
    # split с ограничением: system_name может содержать точки? — нет,
    # но field_id — тоже нет. Всё же используем maxsplit=2, чтобы
    # не «съесть» лишние точки, если они случайно попадут.
    if path.startswith("device."):
        parts = path.split(".", 2)
        if len(parts) != 3 or not parts[1] or not parts[2]:
            raise ValueError(f"Неверный device-путь: {path!r}")
        return _resolve_device(parts[1], parts[2])

    # ---- system.<field> ----
    if path.startswith("system."):
        field = path[len("system."):]
        if not field:
            raise ValueError(f"Неверный system-путь: {path!r}")
        return _resolve_system(field)

    # ---- variable.<name> ----
    if path.startswith("variable."):
        name = path[len("variable."):]
        if not name:
            raise ValueError(f"Неверный variable-путь: {path!r}")
        return _resolve_variable(name)

    # ---- неизвестно ----
    raise ValueError(f"Неизвестный префикс пути: {path!r}")