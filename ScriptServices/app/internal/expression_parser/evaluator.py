import copy
from .ast import Call, Groups, ResObject

class CalculateCall():
    
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