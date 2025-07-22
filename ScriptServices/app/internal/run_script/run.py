from app.internal.run_script.run_script import run
from app.internal.utils.track_background_task import track_background_task
from app.configuration.queue import __queue__

async def run_script(method, properties, body):
    if "service" in body and "object" in body and body["service"] == "script":
        __queue__.add("run_script", id=body["object"])
