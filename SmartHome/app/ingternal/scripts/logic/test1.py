import re
from dataclasses import dataclass
from enum import Enum, auto
from typing import List, Union

# Типы токенов
class TokenType(Enum):
    NUMBER = auto()
    IDENTIFIER = auto()
    OPERATOR = auto()
    LPAREN = auto()
    RPAREN = auto()
    COMMA = auto()
    DOT = auto()
    ASSIGN = auto()
    EOF = auto()

# Структура токена
@dataclass
class Token:
    type: TokenType
    value: str

# AST-узел
@dataclass
class ASTNode:
    type: str
    value: Union[str, None] = None
    children: List['ASTNode'] = None

    def __post_init__(self):
        if self.children is None:
            self.children = []

# Лексер
class Lexer:
    TOKEN_PATTERNS = [
        (TokenType.NUMBER, r'\d+(\.\d+)?'),
        (TokenType.IDENTIFIER, r'[a-zA-Z_][a-zA-Z_0-9]*'),
        (TokenType.OPERATOR, r'(==|!=|<=|>=|&&|\|\||[+\-*/<>])'),
        (TokenType.ASSIGN, r'='),
        (TokenType.LPAREN, r'\('),
        (TokenType.RPAREN, r'\)'),
        (TokenType.COMMA, r','),
        (TokenType.DOT, r'\.'),
    ]

    def __init__(self, text: str):
        self.text = text
        self.tokens = self.tokenize()
        self.current = 0

    def tokenize(self):
        tokens = []
        pos = 0
        while pos < len(self.text):
            match = None
            for token_type, pattern in self.TOKEN_PATTERNS:
                regex = re.compile(pattern)
                match = regex.match(self.text, pos)
                if match:
                    tokens.append(Token(token_type, match.group(0)))
                    pos = match.end()
                    break
            if not match:
                if self.text[pos].isspace():
                    pos += 1
                else:
                    raise ValueError(f"Неожиданный символ: {self.text[pos]}")
        tokens.append(Token(TokenType.EOF, ''))
        return tokens

    def next_token(self):
        if self.current < len(self.tokens):
            token = self.tokens[self.current]
            self.current += 1
            return token
        return Token(TokenType.EOF, '')

# Парсер
class Parser:
    def __init__(self, lexer: Lexer):
        self.lexer = lexer
        self.current_token = self.lexer.next_token()

    def eat(self, token_type: TokenType):
        if self.current_token.type == token_type:
            self.current_token = self.lexer.next_token()
        else:
            raise ValueError(f"Ожидался {token_type}, но получен {self.current_token.type}")

    def parse(self):
        return self.expression()

    def expression(self):
        node = self.term()
        while self.current_token.type == TokenType.OPERATOR and self.current_token.value in ('+', '-', '||'):
            op = self.current_token.value
            self.eat(TokenType.OPERATOR)
            node = ASTNode('binary_op', op, [node, self.term()])
        return node

    def term(self):
        node = self.factor()
        while self.current_token.type == TokenType.OPERATOR and self.current_token.value in ('*', '/', '&&'):
            op = self.current_token.value
            self.eat(TokenType.OPERATOR)
            node = ASTNode('binary_op', op, [node, self.factor()])
        return node

    def factor(self):
        token = self.current_token
        if token.type == TokenType.NUMBER:
            self.eat(TokenType.NUMBER)
            return ASTNode('number', token.value)
        elif token.type == TokenType.IDENTIFIER:
            self.eat(TokenType.IDENTIFIER)
            return ASTNode('identifier', token.value)
        elif token.type == TokenType.LPAREN:
            self.eat(TokenType.LPAREN)
            node = self.expression()
            self.eat(TokenType.RPAREN)
            return node
        else:
            raise ValueError(f"Неожиданный токен: {token.value}")

# Пример использования
if __name__ == "__main__":
    exs = [
        "hjk || a >= b && a < c",
        "a = b + c",
        "a = (5 + 6) * 9",
        "a = 5 + 6 * 9",
        "dev.gf.le()",
        "dev.gf.le",
        "fe.5.g()",
        "fe=45+4/9",
    ]
    for ex in exs:
        lexer = Lexer(ex)
        parser = Parser(lexer)
        ast = parser.parse()
        print()
        print(ast)
        print()


# # Пример использования
# test = Analiz()
# # test.set_text("device.testdev3.level(device.testdev.level * 3)")
# # parsed_result = test.start()
# # test.set_text("device.testdev3.level = device.testdev.level * 3")
# # parsed_result = test.start()
# # test.set_text("a = b + c")
# # parsed_result = test.start()



# for ex in exs:

#     test.set_text(ex)
#     try:
#         parsed_result = test.start()
#         print()
#         print(parsed_result)
#         print()
#     except Exception as e:
#         print("Error", e)

