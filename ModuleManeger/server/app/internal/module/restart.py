import subprocess
from app.internal.module.run_module import run_module_in_container
from app.internal.module.active_modules import load_active_modules

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

def restart_all_active_modules():
	active = load_active_modules()

	for name, info in active.copy().items():
		container_id = info.get("container_id")
		container_name = info.get("container")
		if not container_id:
			# Контейнер не записан или не найден — запустить заново
			print(f"🟡 Для модуля {name} нет container_id — пробуем запустить заново")
			run_module_in_container(name, container_name)
			continue

		# Проверяем, запущен ли контейнер
		is_running = subprocess.run(
			["docker", "ps", "-q", "-f", f"id={container_id}"],
			stdout=subprocess.PIPE, text=True
		).stdout.strip()

		if is_running:
			print(f"🔄 Рестарт контейнера {container_name} ({container_id})")
			restart_container(container_id)
		else:
			print(f"🟠 Контейнер {container_name} ({container_id}) не активен, запускаем заново")
			run_module_in_container(name, container_name)
