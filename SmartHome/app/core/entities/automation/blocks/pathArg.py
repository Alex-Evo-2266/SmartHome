# app/core/automation/path_resolver.py
"""
Резолвер путей PathArg → рантайм-значение.

Поддерживаемые формы:
  device.<system_name>.<field_id>   — значение поля устройства
  room.<room>.<device_type>.<field> — агрегированное значение комнаты
  system.<field>                    — системные данные (time, date, weekday, ...)
  variable.<name>                   — пользовательские переменные

Если путь неизвестен — бросается ValueError, чтобы сценарий не «продолжался
с None» и ошибка была видна на этапе запуска, а не через 3 шага.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Final

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

if TYPE_CHECKING:
    from app.core.entities.automation.automation_context import AutomationContext


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
# Variable-пути
# ============================================================

def _resolve_variable(
    name: str,
    ctx: AutomationContext | None,
    *,
    resolve_reference: bool = True,
) -> Any:
    """
    Получает значение переменной из контекста и, если оно содержит
    ссылку на namespace, разрешает её тем же резолвером путей.
    """
    if not name or "." in name:
        raise ValueError(f"Неверный variable-путь: variable.{name}")
    if ctx is None:
        raise ValueError(
            f"Для разрешения variable.{name} необходим контекст автоматизации"
        )
    if not ctx.has_variable(name):
        raise ValueError(f"Переменная не найдена: variable.{name}")

    ctx.enter_variable(name)
    try:
        value = ctx.get_variable(name)
        if not resolve_reference:
            if not isinstance(value, str) or not value:
                raise ValueError(
                    f"Переменная variable.{name} должна содержать "
                    f"непустой строковый путь, получено: {value!r}"
                )
            return value
        if not isinstance(value, str):
            return value

        prefix = value.split(".", 1)[0]
        if prefix in {"device", "room", "system", "variable"}:
            return resolve_path(PathArg(type="path", path=value), ctx)
        return value
    finally:
        ctx.exit_variable(name)


def _resolve_room(path: str) -> Any:
    """Разрешает полное поле комнаты или поле с уникальным именем."""
    parts = path.split(".")
    if len(parts) not in (3, 4) or any(not part for part in parts):
        raise ValueError(f"Неверный room-путь: {path!r}")

    room_name = parts[1]
    snapshots = get_container().room_store.get_all_snapshots()
    room = next((item for item in snapshots if item.room == room_name), None)
    if room is None:
        raise ValueError(f"Комната не найдена: {room_name!r}")

    if len(parts) == 4:
        device_type, field_name = parts[2], parts[3]
        device = next(
            (item for item in room.devices if item.type_name == device_type),
            None,
        )
        if device is None:
            raise ValueError(
                f"Тип устройства {device_type!r} не найден в комнате {room_name!r}"
            )
        if field_name not in device.state:
            raise ValueError(f"Поле {field_name!r} не найдено в {path!r}")
        value = device.state[field_name]
    else:
        field_name = parts[2]
        values = [
            device.state[field_name]
            for device in room.devices
            if field_name in device.state
        ]
        if not values:
            raise ValueError(
                f"Поле {field_name!r} не найдено в комнате {room_name!r}"
            )
        if len(values) > 1:
            raise ValueError(
                f"Поле {field_name!r} неоднозначно в комнате {room_name!r}; "
                "укажите тип устройства"
            )
        value = values[0]

    if value is None:
        raise DeviceNotValueFound()
    return value


# ============================================================
# Публичная точка входа
# ============================================================

def resolve_path(
    arg: PathArg,
    ctx: AutomationContext | None = None,
    *,
    preserve_path: bool = False,
) -> Any:
    """
    Возвращает значение по PathArg.

    Формы:
      device.<system_name>.<field_id>   — значение поля устройства
      room.<room_name>.<device_type>.<field> — значение поля комнаты
      room.<room_name>.<field>         — значение уникального поля комнаты
      system.<field>                    — системные данные
      variable.<name>                  — пользовательские переменные

    Бросает:
      ValueError          — неизвестный префикс или некорректный путь
      DeviceNotFound      — устройства нет в сторе
      DeviceFieldNotFound — поля нет в описании устройства
      DeviceNotValueFound — значение поля = None
    """
    path = arg.path

    if preserve_path and not path.startswith("variable."):
        return path

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
        if preserve_path:
            return path
        return _resolve_system(field)

    # ---- room.<room>.<device_type>.<field> / room.<room>.<field> ----
    if path.startswith("room."):
        if preserve_path:
            return path
        return _resolve_room(path)

    # ---- variable.<name> ----
    if path.startswith("variable."):
        name = path[len("variable."):]
        if not name:
            raise ValueError(f"Неверный variable-путь: {path!r}")
        return _resolve_variable(
            name,
            ctx,
            resolve_reference=not preserve_path,
        )

    # ---- неизвестно ----
    raise ValueError(f"Неизвестный префикс пути: {path!r}")