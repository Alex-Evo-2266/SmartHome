# core/container.py
from app.core.state.store_container import StoreContainer

_container = None

def get_container() -> StoreContainer:
    global _container
    if _container is None:
        _container = StoreContainer()
    return _container
