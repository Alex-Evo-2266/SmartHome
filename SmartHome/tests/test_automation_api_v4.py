import sys
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException

if "auth_dep_lib" not in sys.modules:
    auth_dep_module = ModuleType("auth_dep_lib")
    setattr(auth_dep_module, "auth_privilege_dep", lambda _: lambda: "test")
    sys.modules["auth_dep_lib"] = auth_dep_module

from app.api.automation import automation_v4 as api
from app.core.state.automation_store_v4 import AutomationManager_V4
from app.db.repositories.automation_v4.automation_io import AutomationStorage


@pytest.fixture
def api_state(tmp_path, monkeypatch):
    manager = AutomationManager_V4()
    storage = AutomationStorage(tmp_path)
    monkeypatch.setattr(api, "get_container", lambda: SimpleNamespace(automation_store=manager))
    monkeypatch.setattr(api, "automation_storage", storage)
    return manager, storage


@pytest.mark.asyncio
async def test_create_update_and_delete_v4_automation(api_state, make_automation):
    manager, storage = api_state
    automation = make_automation(id="night-light", name="Night light")

    created = await api.create_automation(automation, user_id="test")
    assert created == automation
    assert storage.load("night-light") == automation
    assert manager.get_automation_by_id("night-light") == automation

    updated = make_automation(id="night-light", name="Updated night light")
    result = await api.update_automation("night-light", updated, user_id="test")
    assert result == updated
    assert storage.load("night-light") == updated
    assert manager.get_automation_by_id("night-light") == updated

    await api.delete_automation("night-light", user_id="test")
    assert not storage.exists("night-light")
    assert manager.get_automation_by_id("night-light") is None


@pytest.mark.asyncio
async def test_create_rejects_duplicate_id(api_state, make_automation):
    manager, storage = api_state
    automation = make_automation(id="existing")
    storage.save(automation)
    manager.add_automation(automation)

    with pytest.raises(HTTPException) as exc:
        await api.create_automation(automation, user_id="test")
    assert exc.value.status_code == 409


@pytest.mark.asyncio
async def test_update_requires_matching_existing_id(api_state, make_automation):
    manager, _ = api_state
    manager.add_automation(make_automation(id="current"))

    with pytest.raises(HTTPException) as exc:
        await api.update_automation(
            "current",
            make_automation(id="different"),
            user_id="test",
        )
    assert exc.value.status_code == 422


@pytest.mark.asyncio
async def test_manual_run_invokes_runner(api_state, make_automation, monkeypatch):
    manager, _ = api_state
    automation = make_automation(id="manual-run")
    manager.add_automation(automation)
    run_adapter = AsyncMock()
    monkeypatch.setattr(api, "run_adapter", run_adapter)

    result = await api.run_automation("manual-run", user_id="test")

    assert result == {"message": "Автоматизация запущена", "id": "manual-run"}
    run_adapter.assert_awaited_once_with(automation, startStep=None)


@pytest.mark.asyncio
async def test_v4_startup_loads_yaml_and_starts_schedule(monkeypatch):
    from app.lifespan import automation_v4

    class FakeManager:
        def __init__(self):
            self.automations = []
            self.callback = None
            self.cleared = False

        def register_collback(self, callback):
            self.callback = callback

        def clear_automations(self):
            self.cleared = True
            self.automations.clear()

        def add_automation(self, automation):
            self.automations.append(automation)

        async def on_device_patch(self, patch):
            pass

        async def on_room_patch(self, patch):
            pass

    manager = FakeManager()
    device_store = SimpleNamespace(subscribe_patch_global=lambda *args: None)
    room_store = SimpleNamespace(subscribe_patch_global=lambda *args: None)
    container = SimpleNamespace(
        automation_store=manager,
        device_store=device_store,
        room_store=room_store,
    )
    automation = object()
    storage = SimpleNamespace(load_all=lambda: [automation])
    scheduled = {}

    def add_job(function, **kwargs):
        scheduled["function"] = function
        scheduled.update(kwargs)

    scheduler = SimpleNamespace(add_job=add_job)
    monkeypatch.setattr(automation_v4, "get_container", lambda: container)
    monkeypatch.setattr(automation_v4, "automation_storage", storage)
    monkeypatch.setattr(automation_v4, "scheduler", scheduler)

    await automation_v4.start_automation()

    assert manager.cleared
    assert manager.automations == [automation]
    assert manager.callback is automation_v4.run_adapter
    assert scheduled == {
        "function": automation_v4.run_due_automations,
        "trigger": "interval",
        "minutes": 1,
        "id": "automation-v4-run-due",
        "replace_existing": True,
    }
