from queue_lib import QueueItem
from typing import Any
from app.internal.logs import get_base_logger
from app.internal.run_script.run_script import run
from app.internal.utils.track_background_task import track_background_task

logger = get_base_logger.get_logger(__name__)

class RunItem(QueueItem):
	type: str = "run_script"
	id: str
	
async def handle_run(item: RunItem):
	logger.debug(f"Run script: {item.id}")
	await track_background_task(run(item.id))
	logger.debug("Run script successfully")