from typing import List, Dict, Type, Callable, Awaitable, Optional, Any
import asyncio, logging
from contextlib import suppress
from .types import QueueItem


class UniversalQueue:
    def __init__(
        self,
        registrations: Optional[
            Dict[
                str,
                tuple[Type[QueueItem], Callable[[QueueItem], Awaitable[None]]]
            ]
        ] = None,
        logger:Any | None = None
    ):
        self.queue: List[QueueItem] = []
        self.handlers: Dict[str, Callable[[QueueItem], Awaitable[None]]] = {}
        self.schemas: Dict[str, Type[QueueItem]] = {}
        self.logger = logger or logging.getLogger(__name__)

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
        self.logger.info(f"[Queue] Registered queue type: {type_name}")

    def add(self, type_name: str, **kwargs) -> None:
        try:
            self.logger.debug(f"[Queue] Adding item. Type: {type_name}, Data: {kwargs}")
            schema = self.schemas.get(type_name)
            if not schema:
                raise ValueError(f"Unknown queue type: {type_name}")
            item = schema(**kwargs)
            self.queue.append(item)
            self.logger.info(f"[Queue] Item added: {item}")
        except Exception as e:
            self.logger.error(f"[Queue] Failed to add item: {e}", exc_info=True)
            raise

    async def start(self) -> bool:
        self.logger.info(f"[Queue] Starting. Items: {len(self.queue)}")

        if not self.queue:
            self.logger.info("[Queue] Queue is empty.")
            return True

        success = True
        processed_items = 0

        try:
            for idx, item in enumerate(list(self.queue)):
                try:
                    self.logger.debug(f"[Queue] Processing item {idx + 1}: {item}")
                    handler = self.handlers.get(item.type)
                    if not handler:
                        raise ValueError(f"No handler registered for type: {item.type}")
                    await handler(item)
                    processed_items += 1
                except asyncio.CancelledError:
                    self.logger.warning("[Queue] Processing cancelled.")
                    success = False
                    raise
                except Exception as e:
                    self.logger.error(f"[Queue] Error processing item {idx + 1}: {e}", exc_info=True)
                    success = False
                    continue
            return success
        finally:
            with suppress(Exception):
                if success:
                    self.queue.clear()
                    self.logger.info("[Queue] Cleared successfully.")
                else:
                    self.queue = self.queue[processed_items:]
                    self.logger.warning(f"[Queue] Partially processed. Remaining: {len(self.queue)}")
            self.logger.info(f"[Queue] Finished. Success: {success}")