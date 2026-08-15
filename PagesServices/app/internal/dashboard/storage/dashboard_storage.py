from __future__ import annotations

from pathlib import Path
from typing import Literal, TypeVar

import yaml
from pydantic import BaseModel


DashboardScope = Literal["global", "user"]

T = TypeVar("T", bound=BaseModel)


class DashboardStorage:
    """
    Хранилище dashboard в YAML.

    Структура:

        root/
        ├── global/
        │   ├── dashboard-1.yml
        │   └── dashboard-2.yml
        │
        └── users/
            ├── user-1/
            │   ├── dashboard-1.yml
            │   └── dashboard-2.yml
            │
            └── user-2/
                └── dashboard-1.yml
    """

    def __init__(self, root: Path):
        self.root = root

        self.global_path = self.root / "global"
        self.users_path = self.root / "users"

        self.global_path.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.users_path.mkdir(
            parents=True,
            exist_ok=True,
        )

    # ------------------------------------------------------------------
    # PATH
    # ------------------------------------------------------------------

    def _get_directory(
        self,
        scope: DashboardScope,
        user_id: str | None = None,
    ) -> Path:

        if scope == "global":
            return self.global_path

        if scope == "user":
            if not user_id:
                raise ValueError(
                    "user_id is required for user dashboard"
                )

            return self.users_path / user_id

        raise ValueError(
            f"Unknown dashboard scope: {scope}"
        )

    def _get_path(
        self,
        dashboard_id: str,
        scope: DashboardScope,
        user_id: str | None = None,
    ) -> Path:

        directory = self._get_directory(
            scope=scope,
            user_id=user_id,
        )

        return directory / f"{dashboard_id}.yml"

    # ------------------------------------------------------------------
    # SERIALIZATION
    # ------------------------------------------------------------------

    def _load_file(
        self,
        path: Path,
        model: type[T],
    ) -> T:

        with path.open(
            "r",
            encoding="utf-8",
        ) as file:

            data = yaml.safe_load(file)

        if data is None:
            raise ValueError(
                f"Dashboard file is empty: {path}"
            )

        return model.model_validate(data)

    def _save_file(
        self,
        path: Path,
        model: BaseModel,
    ) -> None:

        path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        # Сначала пишем во временный файл.
        # Если процесс упадёт во время записи,
        # основной YAML останется целым.
        tmp_path = path.with_suffix(
            path.suffix + ".tmp"
        )

        data = model.model_dump(
            mode="python",
            exclude_none=True,
        )

        with tmp_path.open(
            "w",
            encoding="utf-8",
        ) as file:

            yaml.safe_dump(
                data,
                file,
                allow_unicode=True,
                sort_keys=False,
                default_flow_style=False,
            )

        tmp_path.replace(path)

    # ------------------------------------------------------------------
    # EXISTS
    # ------------------------------------------------------------------

    def exists(
        self,
        dashboard_id: str,
        scope: DashboardScope,
        user_id: str | None = None,
    ) -> bool:

        path = self._get_path(
            dashboard_id=dashboard_id,
            scope=scope,
            user_id=user_id,
        )

        return path.is_file()

    # ------------------------------------------------------------------
    # GET
    # ------------------------------------------------------------------

    def get(
        self,
        dashboard_id: str,
        model: type[T],
        scope: DashboardScope,
        user_id: str | None = None,
    ) -> T | None:

        path = self._get_path(
            dashboard_id=dashboard_id,
            scope=scope,
            user_id=user_id,
        )

        if not path.is_file():
            return None

        return self._load_file(
            path=path,
            model=model,
        )

    # ------------------------------------------------------------------
    # GET USER OR GLOBAL
    # ------------------------------------------------------------------

    def get_for_user(
        self,
        dashboard_id: str,
        model: type[T],
        user_id: str,
    ) -> T | None:

        # Сначала пользовательский dashboard.
        dashboard = self.get(
            dashboard_id=dashboard_id,
            model=model,
            scope="user",
            user_id=user_id,
        )

        if dashboard is not None:
            return dashboard

        # Если пользовательского нет —
        # возвращаем глобальный.
        return self.get(
            dashboard_id=dashboard_id,
            model=model,
            scope="global",
        )

    # ------------------------------------------------------------------
    # SAVE
    # ------------------------------------------------------------------

    def save(
        self,
        dashboard_id: str,
        dashboard: BaseModel,
        scope: DashboardScope,
        user_id: str | None = None,
    ) -> None:

        path = self._get_path(
            dashboard_id=dashboard_id,
            scope=scope,
            user_id=user_id,
        )

        self._save_file(
            path=path,
            model=dashboard,
        )

    # ------------------------------------------------------------------
    # DELETE
    # ------------------------------------------------------------------

    def delete(
        self,
        dashboard_id: str,
        scope: DashboardScope,
        user_id: str | None = None,
    ) -> bool:

        path = self._get_path(
            dashboard_id=dashboard_id,
            scope=scope,
            user_id=user_id,
        )

        if not path.is_file():
            return False

        path.unlink()

        return True

    # ------------------------------------------------------------------
    # LIST
    # ------------------------------------------------------------------

    def list(
        self,
        model: type[T],
        scope: DashboardScope,
        user_id: str | None = None,
    ) -> list[T]:

        directory = self._get_directory(
            scope=scope,
            user_id=user_id,
        )

        if not directory.exists():
            return []

        result: list[T] = []

        for path in sorted(directory.glob("*.yml")):

            if not path.is_file():
                continue

            result.append(
                self._load_file(
                    path=path,
                    model=model,
                )
            )

        return result

    # ------------------------------------------------------------------
    # LIST FOR USER
    # ------------------------------------------------------------------

    def list_for_user(
        self,
        model: type[T],
        user_id: str,
    ) -> list[T]:

        global_dashboards = self.list(
            model=model,
            scope="global",
        )

        user_dashboards = self.list(
            model=model,
            scope="user",
            user_id=user_id,
        )

        # ID -> dashboard
        result: dict[str, T] = {}

        # Сначала глобальные.
        for dashboard in global_dashboards:

            dashboard_id = getattr(
                dashboard,
                "id",
                None,
            )

            if dashboard_id is None:
                continue

            result[dashboard_id] = dashboard

        # Потом пользовательские.
        # Они перекрывают глобальные.
        for dashboard in user_dashboards:

            dashboard_id = getattr(
                dashboard,
                "id",
                None,
            )

            if dashboard_id is None:
                continue

            result[dashboard_id] = dashboard

        return list(result.values())