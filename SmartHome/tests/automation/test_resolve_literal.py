# tests/test_resolve_literal.py
import pytest
from datetime import time, timedelta

from app.schemas.automation.automation_v4 import LiteralArg
from app.core.entities.automation.blocks.literalArg import (
    resolve_literal,
    _parse_time,
    _parse_duration,
    _parse_iso8601_duration,
)


# ============================================================
# resolve_literal — маршрутизация по data_type
# ============================================================

class TestResolveLiteralRouting:

    def test_number_returns_as_is(self):
        arg = LiteralArg(type="literal", value=42, data_type="number")
        assert resolve_literal(arg) == 42

    def test_number_float(self):
        arg = LiteralArg(type="literal", value=3.14, data_type="number")
        assert resolve_literal(arg) == 3.14

    def test_string_returns_as_is(self):
        arg = LiteralArg(type="literal", value="hello", data_type="string")
        assert resolve_literal(arg) == "hello"

    def test_boolean_true(self):
        arg = LiteralArg(type="literal", value=True, data_type="boolean")
        assert resolve_literal(arg) is True

    def test_boolean_false(self):
        arg = LiteralArg(type="literal", value=False, data_type="boolean")
        assert resolve_literal(arg) is False

    def test_time_parses_to_time(self):
        arg = LiteralArg(type="literal", value="22:30", data_type="time")
        assert resolve_literal(arg) == time(22, 30)

    def test_duration_parses_to_timedelta(self):
        arg = LiteralArg(type="literal", value="PT2M", data_type="duration")
        assert resolve_literal(arg) == timedelta(minutes=2)

    def test_data_type_none_returns_raw_value(self):
        # Если валидатор не сработал — отдаём value как есть
        arg = LiteralArg.model_construct(
            type="literal", value="raw", data_type=None,
        )
        assert resolve_literal(arg) == "raw"

    def test_unknown_data_type_raises(self):
        arg = LiteralArg.model_construct(
            type="literal", value="x", data_type="unknown",
        )
        with pytest.raises(ValueError, match="Неизвестный data_type"):
            resolve_literal(arg)


# ============================================================
# _parse_time
# ============================================================

class TestParseTime:

    def test_hh_mm(self):
        assert _parse_time("22:30") == time(22, 30)

    def test_hh_mm_ss(self):
        assert _parse_time("22:30:45") == time(22, 30, 45)

    def test_midnight(self):
        assert _parse_time("00:00") == time(0, 0)

    def test_end_of_day(self):
        assert _parse_time("23:59:59") == time(23, 59, 59)

    def test_single_digit_hour_raises(self):
        # "9:30" не проходит — нужен "09:30"
        with pytest.raises(ValueError):
            _parse_time("9:30")

    def test_with_microseconds(self):
        assert _parse_time("22:30:45.123456") == time(22, 30, 45, 123456)

    def test_non_string_raises(self):
        with pytest.raises(ValueError, match="time требует строку"):
            _parse_time(2230)

    def test_none_raises(self):
        with pytest.raises(ValueError, match="time требует строку"):
            _parse_time(None)

    def test_invalid_string_raises(self):
        with pytest.raises(ValueError):
            _parse_time("не время")


# ============================================================
# _parse_duration — все поддерживаемые форматы
# ============================================================

class TestParseDurationNumbers:

    def test_int_seconds(self):
        assert _parse_duration(120) == timedelta(seconds=120)

    def test_float_seconds(self):
        assert _parse_duration(1.5) == timedelta(seconds=1.5)

    def test_zero(self):
        assert _parse_duration(0) == timedelta(0)


class TestParseDurationSuffixes:

    def test_seconds_suffix(self):
        assert _parse_duration("120s") == timedelta(seconds=120)

    def test_minutes_suffix(self):
        assert _parse_duration("5m") == timedelta(minutes=5)

    def test_hours_suffix(self):
        assert _parse_duration("2h") == timedelta(hours=2)

    def test_days_suffix(self):
        assert _parse_duration("1d") == timedelta(days=1)

    def test_float_with_suffix(self):
        assert _parse_duration("1.5h") == timedelta(hours=1.5)

    def test_float_minutes(self):
        assert _parse_duration("2.5m") == timedelta(minutes=2.5)


class TestParseDurationIso8601:

    def test_pt2m(self):
        assert _parse_duration("PT2M") == timedelta(minutes=2)

    def test_pt30s(self):
        assert _parse_duration("PT30S") == timedelta(seconds=30)

    def test_pt1h30m(self):
        assert _parse_duration("PT1H30M") == timedelta(hours=1, minutes=30)

    def test_p1dt2h(self):
        assert _parse_duration("P1DT2H") == timedelta(days=1, hours=2)

    def test_pt2m30s(self):
        assert _parse_duration("PT2M30S") == timedelta(minutes=2, seconds=30)

    def test_p1d(self):
        assert _parse_duration("P1D") == timedelta(days=1)

    def test_iso_with_fractional_seconds(self):
        assert _parse_duration("PT1.5S") == timedelta(seconds=1.5)

    def test_iso_empty_returns_zero(self):
        # "P" само по себе — валидный ISO 8601, = 0
        assert _parse_duration("P") == timedelta(0)

    def test_iso_full(self):
        assert _parse_duration("P1DT2H3M4S") == timedelta(
            days=1, hours=2, minutes=3, seconds=4,
        )


class TestParseDurationColon:

    def test_hh_mm(self):
        assert _parse_duration("00:02") == timedelta(minutes=2)

    def test_hh_mm_ss(self):
        assert _parse_duration("00:02:00") == timedelta(minutes=2)

    def test_hours_and_minutes(self):
        assert _parse_duration("01:30:00") == timedelta(hours=1, minutes=30)

    def test_full(self):
        assert _parse_duration("02:30:45") == timedelta(
            hours=2, minutes=30, seconds=45,
        )


class TestParseDurationPlainNumber:

    def test_plain_int_string(self):
        assert _parse_duration("120") == timedelta(seconds=120)

    def test_plain_float_string(self):
        assert _parse_duration("1.5") == timedelta(seconds=1.5)


class TestParseDurationInvalid:

    def test_empty_string(self):
        with pytest.raises(ValueError, match="Не удалось распарсить"):
            _parse_duration("")

    def test_garbage(self):
        with pytest.raises(ValueError, match="Не удалось распарсить"):
            _parse_duration("abc")

    def test_negative_suffix(self):
        # "-5s" — не поддерживается, упадёт
        with pytest.raises(ValueError):
            _parse_duration("-5s")

    def test_none(self):
        with pytest.raises(ValueError, match="duration требует"):
            _parse_duration(None)

    def test_list(self):
        with pytest.raises(ValueError, match="duration требует"):
            _parse_duration([1, 2])


# ============================================================
# _parse_iso8601_duration — напрямую
# ============================================================

class TestParseIso8601Duration:

    def test_pt2m(self):
        assert _parse_iso8601_duration("PT2M") == timedelta(minutes=2)

    def test_p1d(self):
        assert _parse_iso8601_duration("P1D") == timedelta(days=1)

    def test_p1dt2h3m4s(self):
        assert _parse_iso8601_duration("P1DT2H3M4S") == timedelta(
            days=1, hours=2, minutes=3, seconds=4,
        )

    def test_fractional_seconds(self):
        assert _parse_iso8601_duration("PT0.5S") == timedelta(seconds=0.5)

    def test_empty_p(self):
        assert _parse_iso8601_duration("P") == timedelta(0)

    def test_invalid_raises(self):
        with pytest.raises(ValueError, match="Неверный ISO 8601"):
            _parse_iso8601_duration("2M")

    def test_invalid_order_raises(self):
        # Секунды идут последними, M перед S
        with pytest.raises(ValueError):
            _parse_iso8601_duration("PT2S3M")


# ============================================================
# Интеграционные: LiteralArg → значение
# ============================================================

class TestLiteralArgIntegration:

    def test_yaml_style_time(self):
        """Типичный случай из YAML: '22:30' в кавычках."""
        arg = LiteralArg(type="literal", value="22:30", data_type="time")
        assert resolve_literal(arg) == time(22, 30)

    def test_yaml_style_duration(self):
        arg = LiteralArg(type="literal", value="PT2M", data_type="duration")
        assert resolve_literal(arg) == timedelta(minutes=2)

    def test_yaml_style_number(self):
        arg = LiteralArg(type="literal", value=20, data_type="number")
        assert resolve_literal(arg) == 20

    def test_auto_inferred_data_type(self):
        """Если data_type не задан — валидатор должен его вывести."""
        arg = LiteralArg(type="literal", value=42)
        assert arg.data_type == "number"
        assert resolve_literal(arg) == 42

    def test_auto_inferred_bool(self):
        arg = LiteralArg(type="literal", value=True)
        assert arg.data_type == "boolean"
        assert resolve_literal(arg) is True