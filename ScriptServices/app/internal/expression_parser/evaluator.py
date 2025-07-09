import copy
from .ast import Call, Groups, ResObject

class CalculateCall():

    @staticmethod
    def value(node: Call, context: dict, context_command: list[str] = []):
        value = context.get(node.value, None)
        if value is None:
            return None
        if isinstance(value, dict):
            val = value.get("value", None)
            return val
        else:
            return value

    @staticmethod
    def method(node: Call, context: dict, context_command: list[str] = []):
        value = context.get(node.value, None)
        if value is None:
            return None
        if isinstance(value, dict):
            method = value.get("method", None)
            if method is None:
                return None
            call = method.get("call", None)
            if call is not None:
                args = node.args[0].args if len(node.args) > 0 else []
                return call(args, context_command=context_command)
    
    @staticmethod
    def method_args_parse(path: Call, context: dict, context_command: list[str] = []):
        if path is None:
            return None
        if path.type == Groups.IDENTIFIC:
            return CalculateCall.value(node, context, [*context_command, path.value])
        elif path.type == Groups.MEHOD:
            node = copy.copy(path)
            node.args = [CalculateCall.evaluate_call(arg, context) for arg in node.args]
            return CalculateCall.method(node, context, [*context_command, path.value])
        elif path.type == Groups.OBJECT:
            new_context = context.get(path.value, None)
            if type(new_context) is dict:
                res = CalculateCall.method_args_parse(path.atr, new_context, [*context_command, path.value])
                if res is None:
                    return None
                return res
                # if res.type == Groups.MEHOD:
                #     return ResObject(type=Groups.MEHOD, value=Call(type=Groups.OBJECT, value=path.value, args=path.args, atr=res.value))
                # else:
                #     return res
            else:
                res = CalculateCall.method_args_parse(path.atr, {}, [*context_command, path.value])
                if res is None:
                    return None
                return res
                # if res.type == Groups.MEHOD:
                #     return ResObject(type=Groups.MEHOD, value=Call(type=Groups.OBJECT, value=path.value, args=path.args, atr=res.value))
                # else:
                #     return res
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
    def evaluate_call(call: Call, context: dict, context_command: list[str] = []):
        if call.type == Groups.NUMBER:
            return CalculateCall.convert(call.value)

        if call.type == Groups.IDENTIFIC:
            res = CalculateCall.convert(context.get(call.value))
            if res is None:
                return CalculateCall.convert(call.value)
            return res

        if call.type == Groups.OBJECT:
            res = CalculateCall.method_args_parse(call, context)
            return CalculateCall.convert(res)
        
        if call.type == Groups.MEHOD:
            call.args = [CalculateCall.evaluate_call(arg, context) for arg in call.args]
            CalculateCall.method(call, context, [*context_command, call.value])
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