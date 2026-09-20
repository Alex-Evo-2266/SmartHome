# tests/automation/test_path_resolver.py
"""
Тесты для app.core.automation.path_resolver.resolve_path.

Мокаем get_container() и подсовываем фейковый device_store —
настоящий стор тянет settings, БД и т.п.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from app.schemas.automation.automation_v4 import PathArg
from app.schemas.device.device import TypeDeviceField
from app.exceptions.device import (
    DeviceNotFound,
    DeviceNotValueFound,
    DeviceFieldNotFound,
)

# Модуль, который будем патчить
import app.core.entities.automation.blocks.pathArg as pr


# ============================================================
# Фейковые структуры (лёгкие, без Pydantic — не надо)
# ============================================================

def make_field(id: str, name: str, type_: TypeDeviceField) -> SimpleNamespace:
    return SimpleNamespace(id=id, name=name, type=type_)


def make_snapshot(fields: list, state: dict) -> SimpleNamespace:
    return SimpleNamespace(
        description=SimpleNamespace(fields=fields),
        state=state,
    )


class FakeDeviceStore:
    def __init__(self, devices: dict):
        self._devices = devices

    def get_snapshot(self, system_name: str):
        return self._devices.get(system_name)


class FakeContainer:
    def __init__(self, device_store: FakeDeviceStore):
        self.device_store = device_store


# ============================================================
# Фикстуры
# ============================================================

@pytest.fixture
def door_snapshot() -> SimpleNamespace:
    """Устройство 'door' с BINARY-полем state."""
    return make_snapshot(
        fields=[make_field("state", "state", TypeDeviceField.BINARY)],
        state={"state": "1"},
    )


@pytest.fixture
def temp_snapshot() -> SimpleNamespace:
    """Устройство 'temp' с NUMBER-полем value."""
    return make_snapshot(
        fields=[make_field("value", "value", TypeDeviceField.NUMBER)],
        state={"value": "25"},
    )


@pytest.fixture
def text_snapshot() -> SimpleNamespace:
    """Устройство 'label' с TEXT-полем."""
    return make_snapshot(
        fields=[make_field("text", "text", TypeDeviceField.TEXT)],
        state={"text": "hello"},
    )


@pytest.fixture
def fake_container(door_snapshot, temp_snapshot, text_snapshot) -> FakeContainer:
    store = FakeDeviceStore({
        "door": door_snapshot,
        "temp": temp_snapshot,
        "label": text_snapshot,
    })
    return FakeContainer(device_store=store)


@pytest.fixture(autouse=True)
def patch_container(monkeypatch, fake_container):
    """Автоматически подменяет get_container в модуле path_resolver."""
    monkeypatch.setattr(pr, "get_container", lambda: fake_container)
    return fake_container


# ============================================================
# _normalize_binary — все варианты
# ============================================================

@pytest.mark.binary
class TestNormalizeBinary:

    @pytest.mark.parametrize("value", [
        True, 1, "1", "true", "True", "TRUE", "on", "ON", "yes", "YES",
    ])
    def test_true_variants(self, value):
        assert pr._normalize_binary(value) is True

    @pytest.mark.parametrize("value", [
        False, 0, "0", "false", "False", "FALSE", "off", "OFF", "no", "NO",
    ])
    def test_false_variants(self, value):
        assert pr._normalize_binary(value) is False

    def test_bytes_true(self):
        assert pr._normalize_binary(b"1") is True
        assert pr._normalize_binary(b"true") is True

    def test_bytes_false(self):
        assert pr._normalize_binary(b"0") is False
        assert pr._normalize_binary(b"false") is False

    def test_whitespace_stripped(self):
        assert pr._normalize_binary("  1  ") is True
        assert pr._normalize_binary("  0  ") is False

    @pytest.mark.parametrize("value", [
        "10",   # не "1", не "0"
        "2",
        "tru",
        "yes!",
        "unknown",
        "",
    ])
    def test_unknown_raises(self, value):
        with pytest.raises(ValueError, match="Не удалось нормализовать"):
            pr._normalize_binary(value)

    def test_none_raises(self):
        with pytest.raises(ValueError):
            pr._normalize_binary(None)


# ============================================================
# _normalize_number
# ============================================================

@pytest.mark.number
class TestNormalizeNumber:

    def test_int(self):
        assert pr._normalize_number(42) == 42
        assert isinstance(pr._normalize_number(42), int)

    def test_float(self):
        assert pr._normalize_number(42.5) == 42.5
        assert isinstance(pr._normalize_number(42.5), float)

    def test_bool_becomes_int(self):
        assert pr._normalize_number(True) == 1
        assert pr._normalize_number(False) == 0

    def test_string_int(self):
        assert pr._normalize_number("25") == 25
        assert isinstance(pr._normalize_number("25"), int)

    def test_string_float(self):
        assert pr._normalize_number("25.5") == 25.5
        assert isinstance(pr._normalize_number("25.5"), float)

    def test_string_scientific(self):
        assert pr._normalize_number("1e3") == 1000.0

    def test_string_stripped(self):
        assert pr._normalize_number("  42  ") == 42

    def test_bytes(self):
        assert pr._normalize_number(b"25") == 25

    def test_garbage_returns_as_is(self):
        # не число — вернём как есть, не падаем
        assert pr._normalize_number("abc") == "abc"

    def test_none_returns_as_is(self):
        assert pr._normalize_number(None) is None

    def test_list_returns_as_is(self):
        val = [1, 2, 3]
        assert pr._normalize_number(val) is val


# ============================================================
# resolve_path — device.*
# ============================================================

@pytest.mark.device
class TestResolvePathDevice:

    def test_binary_field_returns_bool(self):
        arg = PathArg(type="path", path="device.door.state")
        assert pr.resolve_path(arg) is True

    def test_number_field_returns_int(self):
        arg = PathArg(type="path", path="device.temp.value")
        result = pr.resolve_path(arg)
        assert result == 25
        assert isinstance(result, int)

    def test_text_field_returns_as_is(self):
        arg = PathArg(type="path", path="device.label.text")
        assert pr.resolve_path(arg) == "hello"

    def test_device_not_found(self):
        arg = PathArg(type="path", path="device.ghost.state")
        with pytest.raises(DeviceNotFound):
            pr.resolve_path(arg)

    def test_field_not_found(self):
        arg = PathArg(type="path", path="device.door.nonexistent")
        with pytest.raises(DeviceFieldNotFound):
            pr.resolve_path(arg)

    def test_value_none_raises(self, monkeypatch, fake_container):
        # Перезаписываем state — значение None
        snap = fake_container.device_store._devices["door"]
        snap.state["state"] = None

        arg = PathArg(type="path", path="device.door.state")
        with pytest.raises(DeviceNotValueFound):
            pr.resolve_path(arg)

    def test_no_fields_raises_field_not_found(self, monkeypatch, fake_container):
        snap = fake_container.device_store._devices["door"]
        snap.description.fields = []

        arg = PathArg(type="path", path="device.door.state")
        with pytest.raises(DeviceFieldNotFound):
            pr.resolve_path(arg)

    def test_empty_device_name_raises(self):
        arg = PathArg(type="path", path="device..state")
        with pytest.raises(ValueError, match="Неверный device-путь"):
            pr.resolve_path(arg)

    def test_empty_field_raises(self):
        arg = PathArg(type="path", path="device.door.")
        with pytest.raises(ValueError, match="Неверный device-путь"):
            pr.resolve_path(arg)

    def test_only_two_parts_raises(self):
        arg = PathArg(type="path", path="device.door")
        with pytest.raises(ValueError, match="Неверный device-путь"):
            pr.resolve_path(arg)

    def test_device_name_with_dots_is_safe(self, monkeypatch, fake_container):
        # Имя устройства не должно ломать split, т.к. используется maxsplit=2,
        # но реально в системе точки в имени устройства — плохая практика.
        # Проверим, что даже если оно есть — работает предсказуемо:
        # "device.living.room.light.state" → device="living", field="room.light.state"
        arg = PathArg(type="path", path="device.living.room.light.state")
        # нет такого устройства — DeviceNotFound
        with pytest.raises(DeviceNotFound):
            pr.resolve_path(arg)


# ============================================================
# resolve_path — system.*
# ============================================================
@pytest.mark.system
class TestResolvePathSystem:

    def test_time_format(self):
        arg = PathArg(type="path", path="system.time")
        result = pr.resolve_path(arg)
        assert isinstance(result, str)
        assert re.match(r"^\d{2}:\d{2}:\d{2}$", result), result

    def test_hour_minute_format(self):
        arg = PathArg(type="path", path="system.hour_minute")
        result = pr.resolve_path(arg)
        assert isinstance(result, str)
        assert re.match(r"^\d{2}:\d{2}$", result), result

    def test_date_format(self):
        arg = PathArg(type="path", path="system.date")
        result = pr.resolve_path(arg)
        assert isinstance(result, str)
        assert re.match(r"^\d{4}-\d{2}-\d{2}$", result), result

    def test_weekday_in_range(self):
        arg = PathArg(type="path", path="system.weekday")
        result = pr.resolve_path(arg)
        assert isinstance(result, int)
        assert 0 <= result <= 6

    def test_timestamp_close_to_now(self):
        arg = PathArg(type="path", path="system.timestamp")
        result = pr.resolve_path(arg)
        assert isinstance(result, int)
        now_ts = int(datetime.now(timezone.utc).timestamp())
        assert abs(now_ts - result) < 5

    def test_utc_offset_is_int(self):
        arg = PathArg(type="path", path="system.utc_offset")
        result = pr.resolve_path(arg)
        assert isinstance(result, int)

    def test_unknown_system_field_raises(self):
        arg = PathArg(type="path", path="system.unknown")
        with pytest.raises(ValueError, match="Неизвестное системное поле"):
            pr.resolve_path(arg)

    def test_empty_system_field_raises(self):
        arg = PathArg(type="path", path="system.")
        with pytest.raises(ValueError, match="Неверный system-путь"):
            pr.resolve_path(arg)


# ============================================================
# resolve_path — variable.*
# ============================================================
@pytest.mark.variable
class TestResolvePathVariable:

    def test_variable_not_implemented(self):
        arg = PathArg(type="path", path="variable.counter")
        with pytest.raises(NotImplementedError):
            pr.resolve_path(arg)

    def test_empty_variable_name_raises(self):
        arg = PathArg(type="path", path="variable.")
        with pytest.raises(ValueError, match="Неверный variable-путь"):
            pr.resolve_path(arg)


# ============================================================
# resolve_path — некорректные пути
# ============================================================

@pytest.mark.device
class TestResolvePathInvalid:

    @pytest.mark.parametrize("path", [
        "garbage",
        "room.kitchen.light.state",   # room пока не поддерживается
        "",
        "device",                     # без точки
        "system",                     # без точки
        "unknown.path",
    ])
    def test_unknown_prefix_raises(self, path):
        arg = PathArg(type="path", path=path)
        with pytest.raises(ValueError, match="Неизвестный префикс пути"):
            pr.resolve_path(arg)