import copy
from .ast import Call, Groups, ResObject
from app.internal.sender.device_set_value import sender_device

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
    async def method(node: Call, context: dict, context_command: list[str] = []):
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
                return await call(*args, context_command=context_command)
    
    @staticmethod
    async def method_args_parse(path: Call, context: dict, context_command: list[str] = []):
        if path is None:
            return None
        if path.type == Groups.IDENTIFIC:
            return CalculateCall.value(node, context, [*context_command, path.value])
        elif path.type == Groups.MEHOD:
            node = copy.copy(path)
            node.args = [await CalculateCall.evaluate_call(arg, context) for arg in node.args]
            return await CalculateCall.method(node, context, [*context_command, path.value])
        elif path.type == Groups.OBJECT:
            new_context = context.get(path.value, None)
            if type(new_context) is dict:
                res = await CalculateCall.method_args_parse(path.atr, new_context, [*context_command, path.value])
                if res is None:
                    return None
                return res
                # if res.type == Groups.MEHOD:
                #     return ResObject(type=Groups.MEHOD, value=Call(type=Groups.OBJECT, value=path.value, args=path.args, atr=res.value))
                # else:
                #     return res
            else:
                res = await CalculateCall.method_args_parse(path.atr, {}, [*context_command, path.value])
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
    async def set_device(target, data, context_command):
        print(data, target)
        if len(target) >= 3 and target[0] == "device":
            await sender_device.send({
                "system_name": target[1],
                "field": target[2],
                "value": data
            })

    @staticmethod
    def parse_call(call:Call):
        if call is None:
            return []
        if call.type == Groups.OBJECT:
            return [call.value, *CalculateCall.parse_call(call.atr)]
        if call.type == Groups.IDENTIFIC:
            return [call.value]
        raise Exception("Script error. error sintaxis")

    @staticmethod
    async def evaluate_call(call: Call, context: dict, context_command: list[str] = []):
        if call.type == Groups.NUMBER:
            return CalculateCall.convert(call.value)

        if call.type == Groups.IDENTIFIC:
            res = CalculateCall.convert(context.get(call.value))
            if res is None:
                return CalculateCall.convert(call.value)
            return res

        if call.type == Groups.OBJECT:
            res = await CalculateCall.method_args_parse(call, context)
            return CalculateCall.convert(res)
        
        if call.type == Groups.MEHOD:
            call.args = [await CalculateCall.evaluate_call(arg, context) for arg in call.args]
            await CalculateCall.method(call, context, [*context_command, call.value])
            return CalculateCall.convert(call)

        if call.type == Groups.SET:
            # Присваивание: call.value = call.args[0]
            # right = await CalculateCall.evaluate_call(call.args[0], context)
            # await CalculateCall.set_device(context_command=context_command)
            # call.args = [right]
            # return call  
            right = await CalculateCall.evaluate_call(call.args[0], context)
            return await CalculateCall.set_device(target=CalculateCall.parse_call(call.value), data=right, context_command=context_command)

        if call.type == Groups.PLUS:
            return await CalculateCall.evaluate_call(call.args[0], context) + await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MINUS:
            return await CalculateCall.evaluate_call(call.args[0], context) - await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MULTIPLY:
            return await CalculateCall.evaluate_call(call.args[0], context) * await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.DIVIDE:
            return await CalculateCall.evaluate_call(call.args[0], context) / await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.EQUALLY:
            return await CalculateCall.evaluate_call(call.args[0], context) == await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.NOT_EQUALLY:
            return await CalculateCall.evaluate_call(call.args[0], context) != await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.LESS:
            return await CalculateCall.evaluate_call(call.args[0], context) < await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MORE:
            return await CalculateCall.evaluate_call(call.args[0], context) > await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.LESS_OR_EQUALLY:
            return await CalculateCall.evaluate_call(call.args[0], context) <= await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.MORE_OR_EQUALLY:
            return await CalculateCall.evaluate_call(call.args[0], context) >= await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.AND:
            return await CalculateCall.evaluate_call(call.args[0], context) and await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.OR:
            return await CalculateCall.evaluate_call(call.args[0], context) or await CalculateCall.evaluate_call(call.args[1], context)

        if call.type == Groups.NOT:
            return not await CalculateCall.evaluate_call(call.args[0], context)
        
        if call.type == Groups.GROUP:
            return await CalculateCall.evaluate_call(call.args[0], context)
        
        if call.type == Groups.LIST:
            call.args = [await CalculateCall.evaluate_call(arg, context) for arg in call.args]
            return call
        
        if call.type == Groups.WORD:
            return call.value

        raise NotImplementedError(f"Операция {call.type} не поддерживается")