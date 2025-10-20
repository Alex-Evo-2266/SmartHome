from enum import Enum, auto


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