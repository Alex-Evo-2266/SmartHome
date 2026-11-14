import json
import sys
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI, HTTPException
from pydantic import TypeAdapter

if "auth_dep_lib" not in sys.modules:
    auth_dep_module = ModuleType("auth_dep_lib")
    setattr(auth_dep_module, "auth_privilege_dep", lambda _: lambda: "test")
    sys.modules["auth_dep_lib"] = auth_dep_module

from app.api.automation import automation_v4 as api
from app.core.entities.automation.automation_context import AutomationContext
from app.core.entities.automation.blocks.expression import (
    _FUNCTIONS,
    _LAZY_FUNCTIONS,
    evaluate_expr,
)
from app.core.entities.automation.blocks.expression_capabilities import (
    EXPRESSION_CAPABILITIES,
)
from app.schemas.automation.automation_v4 import (
    AutomationSchema,
    BinaryOp,
    ConditionStep,
    DeviceTrigger,
    Expression,
    ExpressionArg,
    GroupOp,
    LiteralArg,
    UnaryOp,
)
from app.core.state.automation_store_v4 import AutomationManager_V4
from app.core.state import automation_store_v4 as automation_store_module
from app.db.repositories.automation_v4.automation_io import AutomationStorage
from app.schemas.automation.automation_v4 import EnableSchema


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
async def test_enable_endpoint_persists_and_updates_automation(api_state, make_automation, monkeypatch):
    class FakeScheduler:
        running = True

        def get_jobs(self):
            return []

    monkeypatch.setattr(automation_store_module, "scheduler", FakeScheduler())
    manager, storage = api_state
    automation = make_automation(
        id="switchable",
        triggers=[DeviceTrigger(type="device", device="dev1", field="state")],
    )
    manager.add_automation(automation)
    storage.save(automation)

    disabled = await api.enable_automation(
        "switchable",
        EnableSchema(is_enabled=False),
    )
    assert disabled.is_enabled is False
    assert manager.get_automation_by_id("switchable").is_enabled is False
    assert storage.load("switchable").is_enabled is False
    assert manager.device_index == {}

    manager.clear_automations()
    reloaded = storage.load("switchable")
    manager.add_automation(reloaded)
    assert manager.get_automation_by_id("switchable").is_enabled is False
    assert manager.device_index == {}

    enabled = await api.enable_automation(
        "switchable",
        EnableSchema(is_enabled=True),
    )
    assert enabled.is_enabled is True
    assert manager.get_automation_by_id("switchable").is_enabled is True
    assert storage.load("switchable").is_enabled is True
    assert len(manager.device_index[("dev1", "state")].data) == 1


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
async def test_manual_run_rejects_disabled_automation(api_state, make_automation, monkeypatch):
    manager, _ = api_state
    manager.add_automation(
        make_automation(id="disabled-run").model_copy(update={"is_enabled": False})
    )
    run_adapter = AsyncMock()
    monkeypatch.setattr(api, "run_adapter", run_adapter)

    with pytest.raises(HTTPException) as exc:
        await api.run_automation("disabled-run")

    assert exc.value.status_code == 409
    run_adapter.assert_not_awaited()


@pytest.mark.asyncio
async def test_expression_capabilities_endpoint_returns_catalog():
    app = FastAPI()
    app.include_router(api.router)

    messages = []
    received_request = False

    async def receive():
        nonlocal received_request
        if received_request:
            return {"type": "http.disconnect"}
        received_request = True
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(message):
        messages.append(message)

    path = "/api-devices/automation-v4/expression-capabilities"
    await app(
        {
            "type": "http",
            "asgi": {"version": "3.0", "spec_version": "2.3"},
            "http_version": "1.1",
            "method": "GET",
            "scheme": "http",
            "path": path,
            "raw_path": path.encode(),
            "query_string": b"",
            "headers": [],
            "server": ("testserver", 80),
            "client": ("testclient", 50000),
            "root_path": "",
        },
        receive,
        send,
    )

    response_start = next(message for message in messages if message["type"] == "http.response.start")
    response_body = next(message for message in messages if message["type"] == "http.response.body")
    assert response_start["status"] == 200
    assert json.loads(response_body["body"]) == EXPRESSION_CAPABILITIES


def test_expression_capabilities_match_evaluator_and_models():
    operators = EXPRESSION_CAPABILITIES["operators"]
    assert {item["id"] for item in operators["binary"]} == {
        item.value for item in BinaryOp
    }
    assert {item["id"] for item in operators["unary"]} == {
        item.value for item in UnaryOp
    }
    assert {item["id"] for item in operators["group"]} == {
        item.value for item in GroupOp
    }
    assert {item["id"] for item in EXPRESSION_CAPABILITIES["functions"]} == (
        set(_FUNCTIONS) | set(_LAZY_FUNCTIONS)
    )
    assert {
        item["id"]
        for item in EXPRESSION_CAPABILITIES["functions"]
        if item["evaluation"] == "lazy"
    } == set(_LAZY_FUNCTIONS)

    automation = AutomationSchema(
        id="capabilities-test",
        name="Capabilities test",
        entry="condition",
        steps={
            "condition": ConditionStep(
                type="condition",
                condition=LiteralArg(type="literal", value=True),
            )
        },
    )
    context = AutomationContext(automation, {})
    expression_adapter = TypeAdapter(Expression)
    argument_adapter = TypeAdapter(ExpressionArg)

    for argument in EXPRESSION_CAPABILITIES["argument_types"].values():
        argument_adapter.validate_python(argument["example_json"])

    examples = [
        item["example_json"]
        for category in ("binary", "unary", "group")
        for item in operators[category]
    ]
    examples.extend(item["example_json"] for item in EXPRESSION_CAPABILITIES["functions"])

    for example in examples:
        expression = expression_adapter.validate_python(example)
        evaluate_expr(expression, context)


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
