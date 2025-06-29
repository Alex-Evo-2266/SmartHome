import time
from functools import wraps

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

def async_throttle(seconds: float):
    def decorator(func):
        last_called = 0.0

        @wraps(func)
        async def wrapper(*args, **kwargs):
            nonlocal last_called
            now = time.time()
            if now - last_called >= seconds:
                last_called = now
                return await func(*args, **kwargs)
        return wrapper
    return decorator
