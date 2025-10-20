import subprocess
import json
from typing import List
from app.internal.module.schemas.modules import ContainerId
from app.configuration.settings import DEVICE_SERVICE

def get_containers_by_label(labels: List[str]) -> List[ContainerId]:
    """
    Возвращает список контейнеров с указанными лейблами
    и их docker-compose сервисами.
    Формат: [{"name": ..., "container_id": ..., "service": ...}]
    """
    try:
        result = subprocess.run(
            [
                "docker", "ps",
                "--format",
                "{{json .}}"
            ],
            capture_output=True,
            text=True,
            check=True,
        )

        containers: List[ContainerId] = []
        for line in result.stdout.strip().splitlines():
            info = json.loads(line)
            container_labels = info.get("Labels", "") or ""
            if any(label in container_labels for label in labels):
                # вытаскиваем имя сервиса из Labels прямо здесь
                service_name = None
                if "com.docker.compose.service=" in container_labels:
                    # парсим вручную без отдельного docker inspect
                    for pair in container_labels.split(","):
                        if pair.strip().startswith("com.docker.compose.service="):
                            service_name = pair.split("=", 1)[1].strip()
                            break

                containers.append(
                    ContainerId(
                    name=info.get("Names", ""),
                    container_id=info.get("ID", ""),
                    service=service_name
                    )
                )
        return containers

    except subprocess.CalledProcessError as e:
        print("Ошибка при выполнении docker команды:", e)
        return []
    
def get_device_container(labels: List[str]) -> ContainerId:
    """
    Возвращает список контейнеров с указанными лейблами
    и их docker-compose сервисами.
    Формат: [{"name": ..., "container_id": ..., "service": ...}]
    """
    try:
        result = subprocess.run(
            [
                "docker", "ps",
                "--format",
                "{{json .}}"
            ],
            capture_output=True,
            text=True,
            check=True,
        )

        for line in result.stdout.strip().splitlines():
            info = json.loads(line)
            container_labels = info.get("Labels", "") or ""
            if any(label in container_labels for label in labels):
                # вытаскиваем имя сервиса из Labels прямо здесь
                service_name = None
                if "com.docker.compose.service=" in container_labels:
                    # парсим вручную без отдельного docker inspect
                    for pair in container_labels.split(","):
                        if pair.strip().startswith("com.docker.compose.service="):
                            service_name = pair.split("=", 1)[1].strip()
                            if service_name == DEVICE_SERVICE:
                                return ContainerId(
                                    name=info.get("Names", ""),
                                    container_id=info.get("ID", ""),
                                    service=service_name
                                )
                            break

        return None

    except subprocess.CalledProcessError as e:
        print("Ошибка при выполнении docker команды:", e)
        return None