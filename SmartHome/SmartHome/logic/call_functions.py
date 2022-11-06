from datetime import datetime, timedelta
from pydantic import BaseModel
import asyncio
import logging
from typing import Any, Callable, List

logger = logging.getLogger(__name__)

class RunFunctionsItem(BaseModel):
    name: str
    interval: int
    function: Callable[[Any],Any]
    time_run: datetime

class RunFunctions():
    functions:List[RunFunctionsItem] = []

    def subscribe(name: str, function, interval: int = 0):
        for item in RunFunctions.functions:
            if(item.name == name):
                item.interval = interval
                item.function = function
                return None
        RunFunctions.functions.append(RunFunctionsItem(
            function=function,
            name=name,
            interval=interval,
            time_run=datetime.now()
        ))

    def unsubscribe(name: str):
        for item in RunFunctions.functions:
            if(item.name == name):
                del item

    def clear():
        RunFunctions.functions = []

    async def run():
        for item in RunFunctions.functions:
            f = item.function
            await f()
        while True:
            for item in RunFunctions.functions:
                if(item.interval > 0 and datetime.now() > (timedelta(seconds=item.interval) + item.time_run)):
                    try:
                        item.time_run = datetime.now()
                        f = item.function
                        await f()
                    except Exception as e:
                        logger.error(f"error call function {item.name}. detail:{e}")

            await asyncio.sleep(1)
