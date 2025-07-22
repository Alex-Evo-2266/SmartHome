import copy
from .ast import Call, Groups, ResObject
from app.internal.sender.device_set_value import sender_device
from app.internal.logs import get_base_logger

logger = get_base_logger.get_logger(__name__)

class CalculateCall():

    @staticmethod
    def value(node: Call, context: dict, context_command: list[str] = []):
        value = context.get(node.value, None)
        logger.debug(f"[value] node={node.value}, context_command={context_command}, value={value}")
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
        logger.debug(f"[method] node={node.value}, context_command={context_command}, context_val={value}")
        if value is None:
            return None
        if isinstance(value, dict):
            method = value.get("method", None)
            if method is None:
                logger.debug(f"[method] Метод не найден для {node.value}")
                return None
            call = method.get("call", None)
            if call is not None:
                args = node.args[0].args if len(node.args) > 0 else []
                logger.debug(f"[method] Вызов {node.value} с args={args}")
                return await call(*args, context_command=context_command)
            else:
                logger.debug(f"[method] 'call' не определён в методе {node.value}")

    @staticmethod
    async def method_args_parse(path: Call, context: dict, context_command: list[str] = []):
        if path is None:
            return None
        logger.debug(f"[method_args_parse] type={path.type}, value={path.value}, context_command={context_command}")
        if path.type == Groups.IDENTIFIC:
            node = copy.copy(path)
            return CalculateCall.value(node, context, [*context_command, path.value])
        elif path.type == Groups.MEHOD:
            node = copy.copy(path)
            node.args = [await CalculateCall.evaluate_call(arg, context) for arg in node.args]
            return await CalculateCall.method(node, context, [*context_command, path.value])
        elif path.type == Groups.OBJECT:
            new_context = context.get(path.value, None)
            logger.debug(f"[method_args_parse] OBJECT -> new_context={new_context}")
            if type(new_context) is dict:
                res = await CalculateCall.method_args_parse(path.atr, new_context, [*context_command, path.value])
                if res is None:
                    logger.debug(f"[method_args_parse] OBJECT context вернул None (dict)")
                    return None
                return res
            else:
                res = await CalculateCall.method_args_parse(path.atr, {}, [*context_command, path.value])
                if res is None:
                    logger.debug(f"[method_args_parse] OBJECT context вернул None (empty dict)")
                    return None
                return res
        return None

    @staticmethod
    def convert(value):
        """Простое приведение типов"""
        logger.debug(f"[convert] raw={value}")
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
        logger.debug(f"[set_device] target={target}, data={data}, context_command={context_command}")
        if len(target) >= 3 and target[0] == "device":
            await sender_device.send({
                "system_name": target[1],
                "field": target[2],
                "value": data
            })

    @staticmethod
    def parse_call(call: Call):
        if call is None:
            return []
        if call.type == Groups.OBJECT:
            return [call.value, *CalculateCall.parse_call(call.atr)]
        if call.type == Groups.IDENTIFIC:
            return [call.value]
        raise Exception("Script error. error sintaxis")

    @staticmethod
    async def evaluate_call(call: Call, context: dict, context_command: list[str] = []):
        logger.debug(f"[evaluate_call] type={call.type}, value={getattr(call, 'value', None)}")

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

        logger.debug(f"[evaluate_call] NotImplemented for type {call.type}")
        raise NotImplementedError(f"Операция {call.type} не поддерживается")
