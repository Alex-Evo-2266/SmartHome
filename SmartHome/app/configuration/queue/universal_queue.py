from typing import List, Dict, Type, Callable, Awaitable, Optional
from app.ingternal.logs import get_base_logger
import asyncio
from contextlib import suppress
from app.configuration.queue.types import QueueItem

logger = get_base_logger.get_logger(__name__)

class UniversalQueue:
    def __init__(
        self,
        registrations: Optional[
            Dict[
                str,
                tuple[Type[QueueItem], Callable[[QueueItem], Awaitable[None]]]
            ]
        ] = None
    ):
        self.queue: List[QueueItem] = []
        self.handlers: Dict[str, Callable[[QueueItem], Awaitable[None]]] = {}
        self.schemas: Dict[str, Type[QueueItem]] = {}

        if registrations:
            for type_name, (schema, handler) in registrations.items():
                self.register(type_name, schema, handler)

    def register(
        self,
        type_name: str,
        schema: Type[QueueItem],
        handler: Callable[[QueueItem], Awaitable[None]],
    ):
        self.schemas[type_name] = schema
        self.handlers[type_name] = handler
        logger.info(f"[Queue] Registered queue type: {type_name}")

    def add(self, type_name: str, **kwargs) -> None:
        try:
            logger.debug(f"[Queue] Adding item. Type: {type_name}, Data: {kwargs}")
            schema = self.schemas.get(type_name)
            if not schema:
                raise ValueError(f"Unknown queue type: {type_name}")
            item = schema(**kwargs)
            self.queue.append(item)
            logger.info(f"[Queue] Item added: {item}")
        except Exception as e:
            logger.error(f"[Queue] Failed to add item: {e}", exc_info=True)
            raise

    async def start(self) -> bool:
        logger.info(f"[Queue] Starting. Items: {len(self.queue)}")

        if not self.queue:
            logger.info("[Queue] Queue is empty.")
            return True

        success = True
        processed_items = 0

        try:
            for idx, item in enumerate(list(self.queue)):
                try:
                    logger.debug(f"[Queue] Processing item {idx + 1}: {item}")
                    handler = self.handlers.get(item.type)
                    if not handler:
                        raise ValueError(f"No handler registered for type: {item.type}")
                    await handler(item)
                    processed_items += 1
                except asyncio.CancelledError:
                    logger.warning("[Queue] Processing cancelled.")
                    success = False
                    raise
                except Exception as e:
                    logger.error(f"[Queue] Error processing item {idx + 1}: {e}", exc_info=True)
                    success = False
                    continue
            return success
        finally:
            with suppress(Exception):
                if success:
                    self.queue.clear()
                    logger.info("[Queue] Cleared successfully.")
                else:
                    self.queue = self.queue[processed_items:]
                    logger.warning(f"[Queue] Partially processed. Remaining: {len(self.queue)}")
            logger.info(f"[Queue] Finished. Success: {success}")