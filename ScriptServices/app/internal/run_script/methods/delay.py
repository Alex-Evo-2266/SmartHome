import asyncio


async def delay(*args , **keys):
    delay_sec = args[0] / 1000
    await asyncio.sleep(delay_sec)
