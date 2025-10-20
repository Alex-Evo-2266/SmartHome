from .tokens import TOKEN_PATTERNS, TokenType
from .ast import Call, Groups, Token
import re

class CommandAnaliz:
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
                    elif self.curToken:
                        raise ValueError(f"Неожиданный элемент, получено: '{self.curToken.value}'")
                    return c
                raise ValueError(f"Ожидалась закрывающая скобка, получено: '{self.str[:10]}' '{self.curToken}'")
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