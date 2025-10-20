import asyncio
from typing import Set

background_tasks: Set[asyncio.Task] = set()

def track_background_task(coro):
    task = asyncio.create_task(coro)
    background_tasks.add(task)

    def on_done(t: asyncio.Task):
        background_tasks.discard(t)
        if t.exception():
            # необязательно: логгировать ошибку
            print(f"Task raised exception: {t.exception()}")

    task.add_done_callback(on_done)
    return task
