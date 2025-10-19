import subprocess
import json
from typing import List, Dict
from app.internal.module.schemas.modules import ContainerId

def get_containers_by_label(label: str) -> List[Dict[str, str]]:
    """
    Возвращает список контейнеров, у которых есть заданный label.
    Формат: [{"name": str, "container_id": str}]
    """
    try:
        result = subprocess.run(
            ["docker", "ps", "--format", "{{json .}}"],
            capture_output=True,
            text=True,
            check=True,
        )
        containers = []
        for line in result.stdout.strip().splitlines():
            info = json.loads(line)
            labels = info.get("Labels") or ""
            if label in labels:
                containers.append(ContainerId(name=info.get("Names", ""), container_id=info.get("ID")))
        return containers
    except subprocess.CalledProcessError as e:
        print("Ошибка при выполнении docker команды:", e)
        return []
