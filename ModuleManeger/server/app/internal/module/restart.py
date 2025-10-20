import subprocess
from app.configuration.settings import ENV_FILE

def restart_container(container_id: str) -> bool:
    """
    Перезапускает контейнер по ID.
    Возвращает True, если успешно.
    """
    try:
        subprocess.run(["docker", "restart", container_id], check=True)
        print(f"🔄 Контейнер {container_id} перезапущен.")
        return True
    except subprocess.CalledProcessError:
        print(f"❌ Ошибка при перезапуске контейнера {container_id}.")
        return False


# def rebuild_and_restart_container(service_name: str, compose_path: str) -> bool:
#     """
#     Останавливает контейнер (если запущен), пересобирает образ и запускает заново.
#     Работает для docker-compose.
    
#     :param service_name: имя сервиса в docker-compose.yml
#     :param compose_path: путь к директории с docker-compose.yml
#     """
#     print(["docker", "compose", "-f", f"{compose_path}", "stop", service_name])
#     try:
#         # Остановить контейнер, если запущен
#         subprocess.run(
#             ["docker", "compose","--env-file", ENV_FILE, "-f", f"{compose_path}", "stop", service_name],
#             check=False,
#         )

#         # Пересобрать образ
#         subprocess.run(
#             ["docker", "compose","--env-file", ENV_FILE, "-f", f"{compose_path}", "build", service_name],
#             check=True,
#         )

#         # Запустить заново
#         subprocess.run(
#             ["docker", "compose","--env-file", ENV_FILE, "-f", f"{compose_path}", "up", "-d", service_name],
#             check=True,
#         )

#         print(f"🚀 Сервис {service_name} пересобран и запущен заново.")
#         return True
#     except subprocess.CalledProcessError:
#         print(f"❌ Ошибка при пересборке/запуске сервиса {service_name}.")
#         return False
