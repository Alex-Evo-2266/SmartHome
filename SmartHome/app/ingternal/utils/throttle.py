from functools import wraps
import time
from weakref import WeakKeyDictionary
from inspect import signature

def throttle(seconds: float):
    def decorator(func):
        last_called = 0.0  # обычная переменная

        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal last_called  # разрешаем изменять внешнюю переменную
            now = time.time()
            if now - last_called >= seconds:
                last_called = now
                return func(*args, **kwargs)
        return wrapper
    return decorator

# def async_throttle(seconds: float):
#     def decorator(func):
#         last_called = 0.0

#         @wraps(func)
#         async def wrapper(*args, **kwargs):
#             nonlocal last_called
#             now = time.time()
#             if now - last_called >= seconds:
#                 last_called = now
#                 return await func(*args, **kwargs)
#         return wrapper
#     return decorator

def async_throttle(seconds: float):
    def decorator(func):
        last_called_map = WeakKeyDictionary()  # ⬅️ по self

        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            now = time.time()
            last_called = last_called_map.get(self, 0.0)
            print("t333")
            if now - last_called >= seconds:
                last_called_map[self] = now
                return await func(self, *args, **kwargs)
            # иначе пропускаем вызов
        return wrapper
    return decorator

def async_throttle_for_key(seconds: float):
    def decorator(func):
        last_called_map = WeakKeyDictionary()  # {self: {key: timestamp}}

        sig = signature(func)
        has_key_param = "key" in sig.parameters

        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            now = time.time()

            # Определяем значение key (если есть)
            key = None
            if has_key_param:
                # Проверяем в kwargs
                key = kwargs.get("key")
                # Или ищем позиционно (если аргумент передан без имени)
                if key is None:
                    params = list(sig.parameters)
                    if "key" in params:
                        key_index = params.index("key") - 1  # -1 из-за self
                        if 0 <= key_index < len(args):
                            key = args[key_index]

            # Получаем карту вызовов для конкретного экземпляра
            instance_map = last_called_map.setdefault(self, {})

            # Если нет key — используем None как общий ключ
            last_called = instance_map.get(key, 0.0)

            if now - last_called >= seconds:
                instance_map[key] = now
                return await func(self, *args, **kwargs)
            # иначе — пропускаем вызов

        return wrapper

    return decorator