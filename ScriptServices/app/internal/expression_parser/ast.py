from dataclasses import dataclass
from enum import Enum, auto
from typing import Optional, List, Union
from .tokens import TokenType

# Группы для синтаксического анализа
class Groups(Enum):
    NUMBER = auto()         # Числа
    IDENTIFIC = auto()      # Идентификаторы
    OBJECT = auto()         # Объекты
    MEHOD = auto()          # Методы
    TUPLE = auto()          # Кортежи
    GROUP = auto()          # Группы
    LIST = auto()           # Списки
    NOT = auto()            # Логическое НЕ
    SET = auto()            # Присваивание
    AND = auto()            # Логическое И
    OR = auto()             # Логическое ИЛИ
    PLUS = auto()           # Плюс
    MINUS = auto()          # Минус
    MULTIPLY = auto()       # Умножение
    DIVIDE = auto()         # Деление
    NOT_EQUALLY = auto()    # Не равно
    MORE = auto()           # Больше
    LESS = auto()           # Меньше
    EQUALLY = auto()        # Равно
    MORE_OR_EQUALLY = auto()# Больше или равно
    LESS_OR_EQUALLY = auto()# Меньше или равно
    WORD = auto()

    # Классы для представления токенов и вызовов
@dataclass
class Call:
    type: Groups
    value: List["Call"] | "Call" | str
    args: Optional[List["Call"]]
    atr: Optional['Call'] = None

@dataclass
class Token:
    type: TokenType
    value: str

@dataclass
class ResObject:
    type: Groups
    value: str | bool | Call

def print_call_tree(call: Call, indent: int = 0):
    pad = "  " * indent
    print(f"{pad}{call.type.name} → {repr(call.value)}")
    
    if call.args:
        print(f"{pad}  Args:")
        for arg in call.args:
            print_call_tree(arg, indent + 2)

    if call.atr:
        print(f"{pad}  Attr:")
        print_call_tree(call.atr, indent + 2)