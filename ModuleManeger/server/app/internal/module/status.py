import os
import subprocess
import json
from app.configuration.settings import ENV_FILE, MODULES_DIR, CONFIGURATE_DIR
from typing import List, Dict, Any


def get_module_containers_status(name: str) -> Dict[str, Any]:
    """
    Возвращает статусы контейнеров модуля (универсально для всех версий Docker Compose).
    Формат:
    {
        "containers": [
            {"name": "mqtt_page", "state": "running", "status": "Up 29 minutes"},
            ...
        ],
        "all_running": True/False
    }
    """
    module_dir = os.path.join(MODULES_DIR, name)
    compose_file = os.path.join(module_dir, "docker-compose.yml")

    if not os.path.exists(compose_file):
        print(f"⚠️ docker-compose.yml не найден в {module_dir}")
        return {"containers": [], "all_running": False}

    cmd = [
        "docker", "compose",
        "--env-file", ENV_FILE,
        "-f", compose_file,
        "ps", "--all",
        "--format", "json"
    ]

    env = os.environ.copy()
    env["CONFIGURATE_DIR"] = CONFIGURATE_DIR

    try:
        result = subprocess.run(
            cmd,
            cwd=module_dir,
            capture_output=True,
            text=True,
            check=True,
            env=env
        )

        output = result.stdout.strip()
        if not output:
            return {"containers": [], "all_running": False}

        # Docker может вернуть:
        # 1️⃣ один объект
        # 2️⃣ список объектов
        # 3️⃣ объект с ключом "services"
        try:
            data = json.loads(output)
        except json.JSONDecodeError:
            # Иногда docker compose ps выводит несколько JSON-объектов подряд — попробуем построчно
            data = [json.loads(line) for line in output.splitlines() if line.strip()]

        containers: List[Dict[str, Any]] = []

        if isinstance(data, dict):
            if "services" in data:
                # Новый формат
                containers = [
                    {
                        "name": svc.get("Name") or svc.get("name"),
                        "state": svc.get("State") or svc.get("state"),
                        "status": svc.get("Status") or svc.get("status"),
                    }
                    for svc in data["services"].values()
                ]
            else:
                # Один контейнер — просто объект
                containers = [{
                    "name": data.get("Name") or data.get("name"),
                    "state": data.get("State") or data.get("state"),
                    "status": data.get("Status") or data.get("status"),
                }]
        elif isinstance(data, list):
            # Старый формат — список контейнеров
            containers = [
                {
                    "name": c.get("Name") or c.get("name"),
                    "state": c.get("State") or c.get("state"),
                    "status": c.get("Status") or c.get("status"),
                }
                for c in data
            ]

        all_running = all(c["state"] == "running" for c in containers) if containers else False

        return {"containers": containers, "all_running": all_running}

    except subprocess.CalledProcessError as e:
        print(f"⚠️ Ошибка при получении статусов модуля '{name}': {e}")
        return {"containers": [], "all_running": False}