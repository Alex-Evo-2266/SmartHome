import re
from dataclasses import dataclass
from enum import Enum, auto
from typing import Optional, List
import copy


# Определение типов токенов
class TokenType(Enum):
    NUMBER = auto()         # Числа
    PLUS = auto()           # Плюс
    MINUS = auto()          # Минус
    MULTIPLY = auto()       # Умножение
    DIVIDE = auto()         # Деление
    LPAREN = auto()         # Левая скобка
    RPAREN = auto()         # Правая скобка
    WORD = auto()           # Слова (идентификаторы)
    WHITESPACE = auto()     # Пробелы (игнорируем)
    DOT = auto()            # Точка
    COMMA = auto()          # Запятая (для аргументов)
    EQUALLY = auto()        # Равно
    MORE_OR_EQUALLY = auto()# Больше или равно
    LESS_OR_EQUALLY = auto()# Меньше или равно
    AND = auto()            # Логическое И
    OR = auto()             # Логическое ИЛИ
    NOT = auto()            # Логическое НЕ
    NOT_EQUALLY = auto()    # Не равно
    MORE = auto()           # Больше
    LESS = auto()           # Меньше
    SET = auto()            # Присваивание
    QUOTATION_WORD = auto()      # Кавычка

# Определяем типы токенов (более специфичные шаблоны идут раньше)
TOKEN_PATTERNS = [
    (TokenType.EQUALLY, r'=='),
    (TokenType.NOT_EQUALLY, r'!='),
    (TokenType.MORE_OR_EQUALLY, r'>='),
    (TokenType.LESS_OR_EQUALLY, r'<='),
    (TokenType.AND, r'&&'),
    (TokenType.OR, r'\|\|'),
    (TokenType.SET, r'='),
    (TokenType.MORE, r'>'),
    (TokenType.LESS, r'<'),
    (TokenType.NOT, r'!'),
    (TokenType.NUMBER, r'\d+(\.\d+)?'),
    (TokenType.DOT, r'\.'),
    (TokenType.COMMA, r','),
    (TokenType.PLUS, r'\+'),
    (TokenType.MINUS, r'-'),
    (TokenType.MULTIPLY, r'\*'),
    (TokenType.DIVIDE, r'/'),
    (TokenType.LPAREN, r'\('),
    (TokenType.RPAREN, r'\)'),
    (TokenType.WORD, r'[a-zA-Z_][a-zA-Z_0-9]*'),
    (TokenType.WHITESPACE, r'\s+'),
    (TokenType.QUOTATION_WORD, r'\'[a-zA-Z_][a-zA-Z_0-9]*\''),
]

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

'''
S: P9
P9: P8 = P8 | P8
P8: P7 || P8 | P7
P7: P6 && P7 | P6
P6: P5 == P6 | P5 != P6 | P5
P5: P4 (> | < | >= | <=) P5 | P4
P4: P3 + P4 | P3 - P4 | P3
P3: P2 * P3 | P2 / P3 | P2
P2: ! P2 | P1
P1: number | ( S ) | I
I: 'word' | word | word.I | word() | word(L) | word().I | word(L).I
'''

class CommandAnaliz:
    def __init__(self):
        self.str = ""
        self.text = ""
        self.curToken = None
        self.curCommand = Call(type=None, value=None, args=[])

    def set_text(self, text: str):
        """Устанавливает текст для анализа."""
        self.str = text
        self.text = text

    def reload_text(self):
        self.str = self.text
    
    def next_token(self):
        while self.str:
            for token_type, pattern in TOKEN_PATTERNS:
                match = re.match(pattern, self.str)
                if match:
                    value = match.group(0)
                    if token_type != TokenType.WHITESPACE:
                        self.str = self.str[match.end():]
                        return Token(type=token_type, value=value)
                    else:
                        self.str = self.str[match.end():]
                    break
            else:
                # Если ни один шаблон не подошел, выбрасываем исключение
                raise ValueError(f"Неожиданный символ: '{self.str[0]}'" if self.str else "Неожиданный конец строки")


    def get_tree(self):
        '''получить дерево вызовов из установленной строки'''
        self.curToken = self.next_token()
        result = self.S()
        if self.str.strip():  # Проверка на остаток необработанного текста
            raise ValueError(f"Необработанный остаток строки: '{self.str.strip()}'")
        return result

    def S(self)->Call:
        return self.P9()
    
    def I(self):
        '''обработка идентификаторов, объектов, методов'''
        if(self.curToken.type == TokenType.QUOTATION_WORD):
            c = Call(type=Groups.WORD, value=self.curToken.value.strip('\''), args=[])
            self.curToken = self.next_token()
            return c
        elif(self.curToken.type == TokenType.WORD):
            c = Call(type=Groups.IDENTIFIC, value=self.curToken.value, args=[])
            self.curToken = self.next_token()
            if self.curToken and (self.curToken.type == TokenType.DOT):
                c.type = Groups.OBJECT
                self.curToken = self.next_token()
                c.atr = self.I()
                return c
            elif(self.curToken and self.curToken.type == TokenType.LPAREN):
                c.type = Groups.MEHOD
                self.curToken = self.next_token()
                args = [] if self.curToken.type == TokenType.RPAREN else [self.L()]
                if(self.curToken and self.curToken.type == TokenType.RPAREN):
                    self.curToken = self.next_token()
                    c.args = args
                    if self.curToken and (self.curToken.type == TokenType.DOT):
                        self.curToken = self.next_token()
                        c.atr = self.I()
                        return c
                    return c
                raise ValueError(f"Ожидалась закрывающая скобка, получено: '{self.str[:10]}' '{c}'")
            return c
        raise ValueError(f"Ожидался идентификатор, получено: '{self.curToken.type} = {self.curToken.value}'")

    def P1(self):
        '''обработка чисел и группировки в скобках'''
        if(self.curToken.type == TokenType.NUMBER):
            c = Call(type=Groups.NUMBER, value=self.curToken.value, args=None)
            self.curToken = self.next_token()
            return c
        elif(self.curToken.type == TokenType.LPAREN):
            c = Call(type=Groups.GROUP, value=self.curToken.value, args=[])
            self.curToken = self.next_token()
            arg = self.S()
            c.args.append(arg)
            if(self.curToken.type == TokenType.RPAREN):
                self.curToken = self.next_token()
                return c
            else:
                raise ValueError(f"Неожиданный символ: '{self.str[0]}'" if self.str else "Неожиданный конец строки")
        else:
            return self.I()
    
    # def P2(self):
    #     '''обработка отрицания'''
    #     c = self.P1()
    #     if self.curToken and (self.curToken.type == TokenType.NOT):
    #         c = Call(type=Groups.NOT, value=self.curToken.value, args=[c])
    #         self.curToken = self.next_token()
    #         c.args.append(self.P2())
    #         return c
    #     return c
    
    def P2(self):
        '''обработка отрицания'''
        if self.curToken and (self.curToken.type == TokenType.NOT):
            c = Call(type=Groups.NOT, value=self.curToken.value, args=[])
            self.curToken = self.next_token()
            c.args.append(self.P2())
            return c
        c = self.P1()
        return c

    def P3(self):
        '''обработка * и /'''
        c = self.P2()
        if self.curToken and (self.curToken.type == TokenType.MULTIPLY):
            c = Call(type=Groups.MULTIPLY, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P3())
            return c
        elif self.curToken and (self.curToken.type == TokenType.DIVIDE):
            c = Call(type=Groups.DIVIDE, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P3())
            return c
        return c
    
    def P4(self):
        '''обработка + и -'''
        c = self.P3()
        if self.curToken and (self.curToken.type == TokenType.PLUS):
            c = Call(type=Groups.PLUS, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P4())
            return c
        elif self.curToken and (self.curToken.type == TokenType.MINUS):
            c = Call(type=Groups.MINUS, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P4())
            return c
        return c
    
    def P5(self):
        '''обработка > < >= <='''
        c = self.P4()
        if self.curToken and (self.curToken.type == TokenType.LESS):
            c = Call(type=Groups.LESS, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P5())
            return c
        elif self.curToken and (self.curToken.type == TokenType.MORE):
            c = Call(type=Groups.MORE, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P5())
            return c
        elif self.curToken and (self.curToken.type == TokenType.MORE_OR_EQUALLY):
            c = Call(type=Groups.MORE_OR_EQUALLY, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P5())
            return c
        elif self.curToken and (self.curToken.type == TokenType.LESS_OR_EQUALLY):
            c = Call(type=Groups.LESS_OR_EQUALLY, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P5())
            return c
        return c
    
    def P6(self):
        '''обработка == !='''
        c = self.P5()
        if self.curToken and (self.curToken.type == TokenType.EQUALLY):
            c = Call(type=Groups.EQUALLY, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P6())
            return c
        elif self.curToken and (self.curToken.type == TokenType.NOT_EQUALLY):
            c = Call(type=Groups.NOT_EQUALLY, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P6())
            return c
        return c
    
    def P7(self):
        '''обработка &&'''
        c = self.P6()
        if self.curToken and (self.curToken.type == TokenType.AND):
            c = Call(type=Groups.AND, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P7())
            return c
        return c
    
    def P8(self):
        '''обработка ||'''
        c = self.P7()
        if self.curToken and (self.curToken.type == TokenType.OR):
            c = Call(type=Groups.OR, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P8())
            return c
        return c
    
    def P9(self):
        '''обработка присваивания'''
        c = self.P8()
        if self.curToken and (self.curToken.type == TokenType.SET):
            self.curToken = self.next_token()
            c = Call(type=Groups.SET, value=c, args=[self.P8()])
        return c
        
    def L(self):
        """Обработка списка аргументов, разделённых запятыми."""
        items = [self.S()]
        while self.curToken and self.curToken.type == TokenType.COMMA:
            self.curToken = self.next_token()
            items.append(self.S())
        return Call(type=Groups.LIST, value=None, args=items)

@dataclass
class ResObject:
    type: Groups
    value: str | bool | Call


class CalculateCall():

    # @staticmethod
    # def start(call: Call, context: dict):
    #     call_local = copy.copy(call)
    #     if call_local.type == Groups.SET:
    #         right = CalculateCall.evaluate_call(call_local.args[0], context)
    #         call_local.args = [right]
    #         return CalculateCall.convert(call_local)
    #     elif call_local.type == Groups.MEHOD:
    #         call_local.args = [CalculateCall.evaluate_call(arg, context) for arg in call_local.args]
    #         return CalculateCall.convert(call_local)
    #     elif call_local.type == Groups.OBJECT:
    #         res = CalculateCall.method_args_parse(call_local, context)
    #         if res is None:
    #             return CalculateCall.convert(None)
    #         return CalculateCall.convert(res.value)
    #     else:
    #         return CalculateCall.evaluate_call(call_local, context)
    
    @staticmethod
    def method_args_parse(path: Call, context: dict)->ResObject | None:
        if path is None:
            return None
        if path.type == Groups.IDENTIFIC:
            return ResObject(type=Groups.IDENTIFIC, value=context.get(path.value, None))
        elif path.type == Groups.MEHOD:
            node = copy.copy(path)
            node.args = [CalculateCall.evaluate_call(arg, context) for arg in node.args]
            return ResObject(type=Groups.MEHOD, value=node)
        elif path.type == Groups.OBJECT:
            new_context = context.get(path.value, None)
            if type(new_context) is dict:
                res = CalculateCall.method_args_parse(path.atr, new_context)
                if res is None:
                    return None
                if res.type == Groups.MEHOD:
                    return ResObject(type=Groups.MEHOD, value=Call(type=Groups.OBJECT, value=path.value, args=path.args, atr=res.value))
                else:
                    return res
            else:
                res = CalculateCall.method_args_parse(path.atr, {})
                if res is None:
                    return None
                if res.type == Groups.MEHOD:
                    return ResObject(type=Groups.MEHOD, value=Call(type=Groups.OBJECT, value=path.value, args=path.args, atr=res.value))
                else:
                    return None
        return None

    @staticmethod
    def convert(value):
        """Простое приведение типов"""
        if isinstance(value, str):
            if value.lower() in ("true", "false"):
                return value.lower() == "true"
            try:
                return int(value) if '.' not in value else float(value)
            except ValueError:
                return value
        return value

    @staticmethod
    def evaluate_call(call: Call, context: dict):
        if call.type == Groups.NUMBER:
            return CalculateCall.convert(call.value)

        if call.type == Groups.IDENTIFIC:
            res = CalculateCall.convert(context.get(call.value))
            if res is None:
                return CalculateCall.convert(call.value)
            return res

        if call.type == Groups.OBJECT:
            res = CalculateCall.method_args_parse(call, context)
            if res is None:
                return CalculateCall.convert(res)
            return CalculateCall.convert(res.value)
        
        if call.type == Groups.MEHOD:
            call.args = [CalculateCall.evaluate_call(arg, context) for arg in call.args]
            return CalculateCall.convert(call)

        if call.type == Groups.SET:
            # Присваивание: call.value = call.args[0]
            right = CalculateCall.evaluate_call(call.args[0], context)
            call.args = [right]
            return call  

        if call.type == Groups.PLUS:
            return CalculateCall.evaluate_call(call.args[0], context) + CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MINUS:
            return CalculateCall.evaluate_call(call.args[0], context) - CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MULTIPLY:
            return CalculateCall.evaluate_call(call.args[0], context) * CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.DIVIDE:
            return CalculateCall.evaluate_call(call.args[0], context) / CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.EQUALLY:
            return CalculateCall.evaluate_call(call.args[0], context) == CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.NOT_EQUALLY:
            return CalculateCall.evaluate_call(call.args[0], context) != CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.LESS:
            return CalculateCall.evaluate_call(call.args[0], context) < CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MORE:
            return CalculateCall.evaluate_call(call.args[0], context) > CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.LESS_OR_EQUALLY:
            return CalculateCall.evaluate_call(call.args[0], context) <= CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MORE_OR_EQUALLY:
            return CalculateCall.evaluate_call(call.args[0], context) >= CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.AND:
            return CalculateCall.evaluate_call(call.args[0], context) and CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.OR:
            return CalculateCall.evaluate_call(call.args[0], context) or CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.NOT:
            return not CalculateCall.evaluate_call(call.args[0], context)
        
        if call.type == Groups.GROUP:
            return CalculateCall.evaluate_call(call.args[0], context)
        
        if call.type == Groups.LIST:
            call.args = [CalculateCall.evaluate_call(arg, context) for arg in call.args]
            return call
        
        if call.type == Groups.WORD:
            return call.value

        raise NotImplementedError(f"Операция {call.type} не поддерживается")

devices = {
            "lamp1": {
                "f1": "45",
                "f2": "True"
            },
            "lamp2": {
                "f1": "76",
                "f2": "False"
            },
            "lamp3": {
                "f1": "56",
                "f2": "False"
            },
            "d2": {
                "t4": "78",
                "f3": "True"
            }
        }

rooms_dict = {
    "r1":{
        "light": {
            "state": [ 
                {
                    "system_name": "lamp2",
                    "field": "f2"
                },
                {
                    "system_name": "lamp3",
                    "field": "f2"
                }
            ],
            "brightness": [
                {
                    "system_name": "lamp3",
                    "field": "f1"
                },
                {
                    "system_name": "lamp2",
                    "field": "f1"
                }
            ]
        },
        "door": {
            "state": [
                {
                    "system_name": "d2",
                    "field": "f3"
                }
            ]
        }
    }
}
def g(confs:list[dict], devices:dict[str, dict]):
    values = []
    for dev_conf in confs:
        name = dev_conf.get("system_name")
        field = dev_conf.get("field")
        device = devices.get(name, None)
        if device is None:
            continue
        value = device.get(field, None)
        if device is None:
            continue
        values.append(value)
    if len(values) == 1:
        return values[0]
    return min(*values)
def get_context(room:dict, devices:dict):
    room_copy = copy.deepcopy(room)
    for name in room_copy:
        for dev_name in room_copy[name]:
            for field_name in room_copy[name][dev_name]:
                room_copy[name][dev_name][field_name] = g(room_copy[name][dev_name][field_name], devices)
    
    return{
        "device": devices,
        "room": room_copy
    }

# Пример использования
if __name__ == "__main__":

    test = CommandAnaliz()

    exs = [
        "hjk || a >= b && a < c",
        "a = b + c",
        "a = (5 + 6) * 9",
        "a = 5 + 6 * 9",
        "dev.gf.le()",
        "dev.gf.le",
        "fe.5.g()",
        "fe=45+4/9",
        "fe.f.g().g()",
        "fe.f.g(56 + 4).s.g()",
        "fe.f.g(5, 4 + 6 * 2).s.g()",
        "fe.f.g4(56 + 4).s.g()",
        "fe.f.g4(56 + 4.7).s.g()",
        "!tre",
        "!true",
        "device.lamp1.brightness = device.lightSens.lum * 5",
    ]

    for ex in exs:

        test.set_text(ex)
        try:
            print()
            print(ex)
            parsed_result = test.get_tree()
            print_call_tree(parsed_result)
            print()
        except Exception as e:
            print("Error", e)

    context = get_context(rooms_dict, devices)
    expr = "device('lamp').turn_on()"
    parser = CommandAnaliz()
    parser.set_text(expr)
    call_tree = parser.get_tree()
    print_call_tree(call_tree)

    result = CalculateCall.evaluate_call(call_tree, context)
    print("Результат:", result)



import pytest

# Тестовые выражения и ожидаемые типы корневого узла
test_cases = [
    ("a = b + c", Groups.SET),
    ("a = (5 + 6) * 9", Groups.SET),
    ("a = 5 + 6 * 9", Groups.SET),
    ("dev.gf.le()", Groups.OBJECT),
    ("dev.gf.le", Groups.OBJECT),
    ("fe.f.g().g()", Groups.OBJECT),
    ("fe.f.g(5, 4 + 6 * 2).s.g()", Groups.OBJECT),
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

context = get_context(rooms_dict, devices)
print(f"context: {context}")
test_calculate_cases = [
    ("device.lamp1.f1 + 5 * (2 + room.r1.light.brightness)", 335, context),
    ("device.lamp1.f1 = (2 + room.r1.light.brightness)", Call(type=Groups.SET, value=Call(type=Groups.OBJECT, value="device", args=[], atr=Call(type=Groups.OBJECT, value="lamp1", args=[], atr=Call(Groups.IDENTIFIC, args=[], atr=None, value="f1"))), args=[58], atr=None), context),
    ("device.lamp1.f2 == room.r1.light.state", False, context),
    ("device.lamp1.f2 == room.r1.door.state", True, context),
    ("device.lamp1.f2", True, context),
    ("room.r1.light.state", False, context),
    ("delay(1000)", Call(type=Groups.MEHOD, args=[Call(type=Groups.LIST, value=None, atr=None, args=[1000])], atr=None, value="delay"), context),
    ("system.delay(100)", Call(type=Groups.OBJECT, args=[], value="system", atr=Call(type=Groups.MEHOD, value="delay", atr=None, args=[Call(type=Groups.LIST, value=None, atr=None, args=[100])])), context),
    ("true", True, context),
    ("!true", False, context),
    ("!!true", True, context),
]

@pytest.mark.parametrize("expr, expected_res, context", test_calculate_cases)
def test_calculate(expr, expected_res, context):
    parser = CommandAnaliz()
    parser.set_text(expr)
    result = parser.get_tree()
    res = CalculateCall.evaluate_call(result, context)
    assert res == expected_res
