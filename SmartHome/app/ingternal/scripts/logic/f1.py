import re
from dataclasses import dataclass
from enum import Enum, auto
from typing import Optional, List

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
        if(self.curToken.type == TokenType.WORD):
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
                raise ValueError(f"Ожидалась закрывающая скобка, получено: '{self.str[:10]}'")
            return c
        raise ValueError(f"Ожидался идентификатор, получено: '{self.str[:10]}'")

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
    
    def P2(self):
        '''обработка отрицания'''
        c = self.P1()
        if self.curToken and (self.curToken.type == TokenType.NOT):
            c = Call(type=Groups.NOT, value=self.curToken.value, args=[c])
            self.curToken = self.next_token()
            c.args.append(self.P2())
            return c
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
        "device.lamp1.brigtnes = device.lightSens.lum * 5",
    ]

    for ex in exs:

        test.set_text(ex)
        try:
            parsed_result = test.get_tree()
            print()
            print(parsed_result)
            print()
        except Exception as e:
            print("Error", e)

