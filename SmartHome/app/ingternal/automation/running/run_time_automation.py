
from app.ingternal.automation.automation_array.automation_array import AutomationArray
from app.ingternal.automation.running.run_automation import automation_run

from datetime import datetime

async def run_time_automation():
    automations = AutomationArray.get_time_automation()
    print()
    print("triggers", automations, datetime.now())
    print()
    for trigger in automations:
        automation_run(trigger)
