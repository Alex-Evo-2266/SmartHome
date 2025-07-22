from app.configuration.queue.universal_queue import UniversalQueue
from app.internal.listener.handlers.script_run_handler import RunItem, handle_run

__queue__ = UniversalQueue(registrations={
    "run_script": (RunItem, handle_run),
})