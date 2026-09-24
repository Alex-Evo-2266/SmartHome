# tests/automation/test_automation_storage.py
import pytest
from pathlib import Path

from app.schemas.automation.automation_v4 import (
    AutomationSchema, LiteralArg, DelayStep, WeeklyTimeTrigger,
)
from app.db.repositories.automation_v4.automation_io import (
    AutomationStorage, AutomationIOError,
)


def make_automation(id="s1", name="Ночной свет") -> AutomationSchema:
    return AutomationSchema(
        id=id, name=name, entry="s1",
        trigger=[WeeklyTimeTrigger(
            type="time", kind="weekly",
            at="22:30", weekdays=[0, 1],
        )],
        steps={"s1": DelayStep(
            type="delay",
            duration=LiteralArg(type="literal", value=60, data_type="number"),
            next=None,
        )},
        expressions={},
    )


@pytest.fixture
def storage(tmp_path: Path) -> AutomationStorage:
    return AutomationStorage(tmp_path)


class TestSingle:

    def test_save_creates_file(self, storage):
        path = storage.save(make_automation(id="a"))
        assert path.exists()
        assert path.name == "a.yaml"

    def test_load_roundtrip(self, storage):
        a = make_automation(id="x", name="Тест")
        storage.save(a)
        a2 = storage.load("x")
        assert a2.id == a.id
        assert a2.name == "Тест"

    def test_exists(self, storage):
        assert storage.exists("x") is False
        storage.save(make_automation(id="x"))
        assert storage.exists("x") is True

    def test_load_missing(self, storage):
        with pytest.raises(AutomationIOError, match="не найден"):
            storage.load("nope")

    def test_delete(self, storage):
        storage.save(make_automation(id="x"))
        assert storage.delete("x") is True
        assert storage.delete("x") is False   # уже нет

    def test_overwrite(self, storage):
        storage.save(make_automation(id="x", name="v1"))
        storage.save(make_automation(id="x", name="v2"))
        assert storage.load("x").name == "v2"

    def test_unsafe_id_sanitized(self, storage):
        storage.save(make_automation(id="a/b"))
        assert (storage.directory / "a_b.yaml").exists()


class TestString:

    def test_dumps_loads_roundtrip(self, storage):
        a = make_automation()
        text = storage.dumps(a)
        a2 = storage.loads(text)
        assert a2.id == a.id

    def test_unicode_preserved(self, storage):
        text = storage.dumps(make_automation(name="Ночной свет"))
        assert "Ночной свет" in text
        assert "\\u" not in text

    def test_none_fields_omitted(self, storage):
        text = storage.dumps(make_automation())
        assert "label: null" not in text

    def test_empty_raises(self, storage):
        with pytest.raises(AutomationIOError, match="Пустой"):
            storage.loads("")

    def test_non_dict_raises(self, storage):
        with pytest.raises(AutomationIOError, match="объект"):
            storage.loads("- a\n- b")

    def test_invalid_schema(self, storage):
        with pytest.raises(AutomationIOError, match="Некорректный"):
            storage.loads("id: x\nname: y\n")


class TestMany:

    def test_list_ids(self, storage):
        for i in range(3):
            storage.save(make_automation(id=f"s{i}"))
        assert storage.list_ids() == ["s0", "s1", "s2"]

    def test_load_all(self, storage):
        for i in range(3):
            storage.save(make_automation(id=f"s{i}"))
        loaded = storage.load_all()
        assert {a.id for a in loaded} == {"s0", "s1", "s2"}

    def test_load_all_strict_false_skips(self, storage):
        storage.save(make_automation(id="ok"))
        (storage.directory / "bad.yaml").write_text("id: x\n", encoding="utf-8")
        loaded = storage.load_all(strict=False)
        assert [a.id for a in loaded] == ["ok"]

    def test_load_all_strict_true_raises(self, storage):
        (storage.directory / "bad.yaml").write_text("id: x\n", encoding="utf-8")
        with pytest.raises(AutomationIOError):
            storage.load_all(strict=True)

    def test_load_all_with_errors(self, storage):
        storage.save(make_automation(id="ok"))
        (storage.directory / "bad.yaml").write_text("id: x\n", encoding="utf-8")
        items, errors = storage.load_all_with_errors()
        assert [a.id for a in items] == ["ok"]
        assert len(errors) == 1
        assert errors[0][0].name == "bad.yaml"

    def test_save_all_delete_missing(self, storage):
        storage.save_all([make_automation(id="a")])
        storage.save_all([make_automation(id="b")], delete_missing=True)
        assert storage.list_ids() == ["b"]


class TestConstructor:

    def test_create_new_directory(self, tmp_path: Path):
        d = tmp_path / "new" / "dir"
        AutomationStorage(d, create=True)
        assert d.is_dir()

    def test_missing_directory_without_create(self, tmp_path: Path):
        with pytest.raises(AutomationIOError, match="не найдена"):
            AutomationStorage(tmp_path / "nope", create=False)

    def test_existing_directory(self, tmp_path: Path):
        s = AutomationStorage(tmp_path, create=False)
        assert s.directory == tmp_path