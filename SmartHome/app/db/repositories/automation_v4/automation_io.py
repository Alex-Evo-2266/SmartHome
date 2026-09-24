# app/core/entities/automation/automation_storage.py
"""
Хранилище сценариев в YAML-файлах.

Один класс на директорию: все сценарии лежат в {directory}/{id}.yaml.
Директория задаётся в конструкторе — все операции работают с ней.

Особенности:
  - Запись атомарная: temp-файл рядом + os.replace.
  - Unicode не экранируется (allow_unicode=True).
  - Порядок полей сохраняется как в модели (sort_keys=False).
  - Чтение через safe_load — никаких arbitrary Python-объектов.
  - Ошибки Pydantic оборачиваются в AutomationIOError.
"""
from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import Any, Iterable

import yaml
from pydantic import ValidationError

from app.schemas.automation.automation_v4 import AutomationSchema
from app.bootstrap.const import AUTOMATION_DIR

try:
    from yaml import CSafeLoader as _SafeLoader
    from yaml import CSafeDumper as _SafeDumper
except ImportError:  # pragma: no cover
    from yaml import SafeLoader as _SafeLoader
    from yaml import SafeDumper as _SafeDumper


# ============================================================
# Ошибки
# ============================================================

class AutomationIOError(Exception):
    """Ошибка чтения/записи YAML сценария."""


# ============================================================
# Хранилище
# ============================================================

class AutomationStorage:
    """
    Файловое хранилище сценариев.

    Пример:
        storage = AutomationStorage("scenarios/")
        storage.save(automation)
        automation = storage.load("night_light")

        all_items = storage.load_all(strict=False)
        storage.save_all(items, delete_missing=True)
    """

    _DUMP_KWARGS: dict[str, Any] = dict(
        Dumper=_SafeDumper,
        allow_unicode=True,
        sort_keys=False,
        default_flow_style=False,
        width=120,
        indent=2,
    )

    _UNSAFE_CHARS = set('<>:"/\\|?*')

    def __init__(self, directory: str | Path, *, create: bool = True) -> None:
        """
        :param directory: директория, где лежат .yaml-файлы сценариев
        :param create: создать директорию, если её нет
        """
        self.directory = Path(directory)
        if create:
            self.directory.mkdir(parents=True, exist_ok=True)
        elif not self.directory.exists():
            raise AutomationIOError(f"Директория не найдена: {self.directory}")

    # ==========================================================
    # Один сценарий
    # ==========================================================

    def path_for(self, automation_id: str) -> Path:
        """Путь к файлу сценария по id."""
        return self.directory / f"{self._safe_filename(automation_id)}.yaml"

    def exists(self, automation_id: str) -> bool:
        return self.path_for(automation_id).is_file()

    def save(self, automation: AutomationSchema) -> Path:
        """
        Сохраняет сценарий в файл атомарно:
        пишем во временный файл рядом, потом os.replace.
        """
        path = self.path_for(automation.id)
        text = self.dumps(automation)

        fd, tmp_path = tempfile.mkstemp(
            dir=str(path.parent),
            prefix=f".{path.name}.",
            suffix=".tmp",
        )
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.write(text)
                f.flush()
                os.fsync(f.fileno())
            os.replace(tmp_path, path)
        except Exception:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
            raise
        return path

    def load(self, automation_id: str) -> AutomationSchema:
        """Загружает сценарий по id."""
        path = self.path_for(automation_id)
        if not path.exists():
            raise AutomationIOError(f"Файл не найден: {path}")
        return self._load_file(path)

    def delete(self, automation_id: str) -> bool:
        """
        Удаляет файл сценария.
        Возвращает True, если удалили, False если файла не было.
        """
        path = self.path_for(automation_id)
        try:
            path.unlink()
            return True
        except FileNotFoundError:
            return False
        except OSError as e:
            raise AutomationIOError(f"Не удалось удалить {path}: {e}") from e

    # ==========================================================
    # Строки
    # ==========================================================

    def dumps(self, automation: AutomationSchema) -> str:
        """AutomationSchema → YAML-строка."""
        data = automation.model_dump(mode="json", exclude_none=True)
        try:
            return yaml.dump(data, **self._DUMP_KWARGS)
        except yaml.YAMLError as e:
            raise AutomationIOError(f"Не удалось сериализовать YAML: {e}") from e

    def loads(self, yaml_text: str) -> AutomationSchema:
        """YAML-строка → AutomationSchema."""
        try:
            raw = yaml.load(yaml_text, Loader=_SafeLoader)
        except yaml.YAMLError as e:
            raise AutomationIOError(f"Не удалось распарсить YAML: {e}") from e

        if raw is None:
            raise AutomationIOError("Пустой YAML-документ")
        if not isinstance(raw, dict):
            raise AutomationIOError(
                f"Ожидался объект на верхнем уровне, "
                f"получили {type(raw).__name__}"
            )
        return self._to_schema(raw)

    # ==========================================================
    # Массовые операции
    # ==========================================================

    def list_ids(self) -> list[str]:
        """Список id сценариев (по именам .yaml-файлов)."""
        return sorted(p.stem for p in self.directory.glob("*.yaml"))

    def load_all(
        self,
        *,
        strict: bool = True,
    ) -> list[AutomationSchema]:
        """
        Читает все .yaml-файлы директории.

        :param strict: True — первая ошибка прерывает загрузку.
                       False — битые файлы пропускаются.
        """
        result: list[AutomationSchema] = []
        for path in sorted(self.directory.glob("*.yaml")):
            try:
                result.append(self._load_file(path))
            except AutomationIOError:
                if strict:
                    raise
                continue
        return result

    def load_all_with_errors(
        self,
    ) -> tuple[list[AutomationSchema], list[tuple[Path, str]]]:
        """
        Как load_all(strict=False), но возвращает ещё список ошибок:
        [(path, error_message), ...]
        """
        result: list[AutomationSchema] = []
        errors: list[tuple[Path, str]] = []
        for path in sorted(self.directory.glob("*.yaml")):
            try:
                result.append(self._load_file(path))
            except AutomationIOError as e:
                errors.append((path, str(e)))
        return result, errors

    def save_all(
        self,
        automations: Iterable[AutomationSchema],
        *,
        delete_missing: bool = False,
    ) -> list[Path]:
        """
        Сохраняет список сценариев.

        :param delete_missing: удалить .yaml-файлы, которых нет в automations.
        :return: список путей записанных файлов.
        """
        written: list[Path] = []
        keep_names: set[str] = set()

        for automation in automations:
            path = self.save(automation)
            written.append(path)
            keep_names.add(path.name)

        if delete_missing:
            for path in self.directory.glob("*.yaml"):
                if path.name not in keep_names:
                    try:
                        path.unlink()
                    except OSError:
                        # удаление мусора не должно ломать основную операцию
                        pass

        return written

    # ==========================================================
    # Внутренние
    # ==========================================================

    def _load_file(self, path: Path) -> AutomationSchema:
        try:
            text = path.read_text(encoding="utf-8")
        except OSError as e:
            raise AutomationIOError(f"Не удалось прочитать {path}: {e}") from e

        try:
            return self.loads(text)
        except AutomationIOError as e:
            raise AutomationIOError(f"{path}: {e}") from e

    @staticmethod
    def _to_schema(data: dict[str, Any]) -> AutomationSchema:
        try:
            return AutomationSchema.model_validate(data)
        except ValidationError as e:
            raise AutomationIOError(f"Некорректный сценарий: {e}") from e

    @classmethod
    def _safe_filename(cls, name: str) -> str:
        if not name:
            raise AutomationIOError("Пустой id сценария")

        safe = []
        for ch in name:
            if ch in cls._UNSAFE_CHARS or ord(ch) < 32:
                safe.append("_")
            else:
                safe.append(ch)

        result = "".join(safe).strip(". ")
        if not result:
            raise AutomationIOError(
                f"Невозможно преобразовать id в имя файла: {name!r}"
            )
        return result

automation_storage = AutomationStorage(AUTOMATION_DIR)