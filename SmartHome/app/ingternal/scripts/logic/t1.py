import pytest
from .f1 import CommandAnaliz, Call, Groups

# Тестовые выражения и ожидаемые типы корневого узла
test_cases = [
    ("a = b + c", Groups.SET),
    ("a = (5 + 6) * 9", Groups.SET),
    ("a = 5 + 6 * 9", Groups.SET),
    ("dev.gf.le()", Groups.MEHOD),
    ("dev.gf.le", Groups.OBJECT),
    ("fe.f.g().g()", Groups.MEHOD),
    ("fe.f.g(5, 4 + 6 * 2).s.g()", Groups.MEHOD),
    ("device.lamp1.brigtnes = device.lightSens.lum * 5", Groups.SET),
    ("a >= b && a < c", Groups.AND),
    ("a == b || c != d", Groups.OR),
]

@pytest.mark.parametrize("expr, expected_group", test_cases)
def test_parser_returns_correct_group(expr, expected_group):
    parser = CommandAnaliz()
    parser.set_text(expr)
    result = parser.get_tree()
    assert isinstance(result, Call)
    assert result.type == expected_group
