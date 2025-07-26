from functools import wraps
import time
from weakref import WeakKeyDictionary

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
            if now - last_called >= seconds:
                last_called_map[self] = now
                return await func(self, *args, **kwargs)
            # иначе пропускаем вызов
        return wrapper
    return decorator