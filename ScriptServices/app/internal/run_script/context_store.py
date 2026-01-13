from app.internal.logs import MyLogger
from app.internal.run_script.context_build import get_base_context

logger = MyLogger().get_logger(__name__)

class ContextStore:
    def __init__(self, data: dict):
        self._data = data
        logger.info(f"[ContextStore] initialized with data: {self._data}")

    def all(self):
        logger.info("[ContextStore] all() called")
        return self._data

    def get(self, key: str):
        """
        key: 'device.lamp1.power'
        """
        parts = key.split(".")
        cur = self._data

        for part in parts:
            if not isinstance(cur, dict):
                logger.info(f"[ContextStore] get('{key}') -> None (not dict at {part})")
                return None
            cur = cur.get(part)
            if cur is None:
                logger.info(f"[ContextStore] get('{key}') -> None (missing {part})")
                return None

        logger.info(f"[ContextStore] get('{key}') -> {cur}")
        return cur

    def has(self, key: str) -> bool:
        exists = self.get(key) is not None
        logger.info(f"[ContextStore] has('{key}') -> {exists}")
        return exists

    def update(self, base_key: str, data: dict):
        """
        update('device.lamp1', {...})
        """
        logger.info(f"[ContextStore] update('{base_key}', {data}) called")
        parts = base_key.split(".")
        cur = self._data

        for part in parts:
            cur = cur.setdefault(part, {})

        self._deep_update(cur, data)
        logger.info(f"[ContextStore] update('{base_key}') finished")

    def _deep_update(self, target: dict, source: dict):
        for k, v in source.items():
            if isinstance(v, dict) and isinstance(target.get(k), dict):
                self._deep_update(target[k], v)
            else:
                logger.info(f"[ContextStore] _deep_update: setting '{k}' = {v}")
                target[k] = v


context = ContextStore(get_base_context())
