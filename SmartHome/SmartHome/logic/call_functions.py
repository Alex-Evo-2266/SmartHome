from datetime import datetime, timedelta
import asyncio

class RunFunctions():
    def __init__(self):
        self.functions = []

    def subscribe(self, name: str, function, interval: int = 0):
        for item in self.functions:
            if(item['name'] == name):
                item['interval'] = interval
                item['function'] = function
                return None
        self.functions.append({
            "function":function,
            "name":name,
            "interval":interval,
            "time_run":datetime.now()
        })

    def unsubscribe(self, name: str):
        for item in self.functions:
            if(item['name'] == name):
                del item

    def clear(self):
        self.functions = []

    async def run(self):
        for item in self.functions:
            f = item['function']
            await f()
        while True:
            for item in self.functions:
                if(item['interval'] > 0 and datetime.now() > (timedelta(seconds=item['interval']) + item['time_run'])):
                    item['time_run'] = datetime.now()
                    f = item['function']
                    await f()
            await asyncio.sleep(1)


call_functions = RunFunctions()
