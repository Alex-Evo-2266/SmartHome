
from app.ingternal.scripts.trigger_array.trigger_array import TriggerArray
from app.ingternal.scripts.running.run_trigger import trigger_run

from datetime import datetime

async def run_time_trigger():
    triggers = TriggerArray.get_time_trigger()
    print()
    print("triggers", triggers, datetime.now())
    print()
    for trigger in triggers:
        trigger_run(trigger)
