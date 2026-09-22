from datetime import time, timedelta
from app.schemas.automation.automation_v4 import LiteralArg

def resolve_literal(arg: LiteralArg) -> int | float | bool | str | time | timedelta | None:
    """
    Преобразует LiteralArg в рантайм-значение.

    - number   → int | float
    - string   → str
    - boolean  → bool
    - time     → datetime.time   ("22:30" → time(22, 30))
    - duration → datetime.timedelta ("00:02:00" | "120s" | "PT2M" → timedelta)

    Если data_type не задан (модель уже должна была его вывести),
    возвращает value как есть.
    """
    # if arg.value is None:
    #     return

    if arg.data_type is None:
        # Защита: до сюда не должно доходить, если валидатор включён
        return arg.value

    if arg.data_type == "number":
        return arg.value

    if arg.data_type == "string":
        return arg.value

    if arg.data_type == "boolean":
        return arg.value

    if arg.data_type == "time":
        return _parse_time(arg.value)

    if arg.data_type == "duration":
        return _parse_duration(arg.value)

    raise ValueError(f"Неизвестный data_type: {arg.data_type!r}")


def _parse_time(value) -> time:
    if not isinstance(value, str):
        raise ValueError(f"time требует строку, получили {value!r}")
    # Поддерживаем "22:30" и "22:30:00"
    return time.fromisoformat(value)


def _parse_duration(value) -> timedelta:
    """
    Поддерживаем несколько форматов:
    - "PT2M"      — ISO 8601 (строкой)
    - "00:02:00"  — как time
    - "120"       — число секунд (если вдруг data_type='duration', value=str)
    - "120s"      — число + суффикс (s / m / h / d)
    """
    if isinstance(value, (int, float)):
        return timedelta(seconds=value)

    if not isinstance(value, str):
        raise ValueError(f"duration требует строку или число, получили {value!r}")

    s = value.strip()

    # "120s", "5m", "2h", "1d"
    if s and s[-1] in "smhd" and s[:-1].replace(".", "", 1).isdigit():
        n = float(s[:-1])
        unit = s[-1]
        return timedelta(**{
            "s": "seconds",
            "m": "minutes",
            "h": "hours",
            "d": "days",
        }[unit] == "seconds" and {"seconds": n} or
        {  # fallback не нужен — ниже
            "s": {"seconds": n},
            "m": {"minutes": n},
            "h": {"hours": n},
            "d": {"days": n},
        }[unit])

    # ISO 8601: PT2M30S
    if s.startswith("PT") or s.startswith("P"):
        return _parse_iso8601_duration(s)

    # "HH:MM" или "HH:MM:SS"
    if ":" in s:
        t = time.fromisoformat(s)
        return timedelta(
            hours=t.hour,
            minutes=t.minute,
            seconds=t.second,
        )

    # Просто число секунд строкой
    if s.replace(".", "", 1).isdigit():
        return timedelta(seconds=float(s))

    raise ValueError(f"Не удалось распарсить duration: {value!r}")


def _parse_iso8601_duration(s: str) -> timedelta:
    """Разбор ISO 8601 duration: 'PT2M30S', 'P1DT2H', ..."""
    import re
    pattern = re.compile(
        r"^P"
        r"(?:(?P<days>\d+)D)?"
        r"(?:T"
        r"(?:(?P<hours>\d+)H)?"
        r"(?:(?P<minutes>\d+)M)?"
        r"(?:(?P<seconds>\d+(?:\.\d+)?)S)?"
        r")?$"
    )
    m = pattern.match(s)
    if not m:
        raise ValueError(f"Неверный ISO 8601 duration: {s!r}")

    parts = {k: float(v) for k, v in m.groupdict().items() if v is not None}
    return timedelta(
        days=parts.get("days", 0),
        hours=parts.get("hours", 0),
        minutes=parts.get("minutes", 0),
        seconds=parts.get("seconds", 0),
    )