import os
import subprocess
from app.configuration.settings import ENV_FILE, CONFIG_SERVICES_DIR, MODULES_DIR, BASE_DIR, CONFIGURATE_DIR
import shutil

def update_env_var_to_local(key: str, value: str, env_file: str = ENV_FILE) -> str:
	"""
	Создаёт копию .env с изменённым ключом и возвращает путь к .local.env файлу.
	"""
	if not os.path.exists(env_file):
		raise FileNotFoundError(f".env файл не найден: {env_file}")

	local_env_file = os.path.join(BASE_DIR, ".local.env")

	shutil.copy(env_file, local_env_file)

	lines = []
	found = False
	with open(local_env_file, "r", encoding="utf-8") as f:
		for line in f:
			print(f"p9999 {line}")
			if line.strip().startswith(f"{key}="):
				lines.append(f"{key}={value}\n")
				found = True
			else:
				lines.append(line)

	if not found:
		lines.append(f"{key}={value}\n")

	with open(local_env_file, "w", encoding="utf-8") as f:
		f.writelines(lines)

	return local_env_file



def run_module_in_container(name: str):
	"""
	Запускает модуль через docker compose внутри контейнера modules_manager,
	используя .env файл, чтобы подставить NETWORK_NAME и другие переменные.
	"""

	module_dir = os.path.join(MODULES_DIR, name)

	env = update_env_var_to_local("CONFIGURATE_DIR", os.path.join(CONFIGURATE_DIR, name))

	compose_file = os.path.join(module_dir, "docker-compose.yml")
	if not os.path.exists(compose_file):
		raise FileNotFoundError(f"docker-compose.yml не найден в {module_dir}")

	cmd = [
		"docker", "compose",
		"--env-file", env,
		"-f", compose_file,
		"up", "-d"
	]

	try:
		subprocess.run(cmd, cwd=module_dir, check=True)
		print(f"✅ Модуль {module_dir} запущен в контейнере")
	except subprocess.CalledProcessError as e:
		print(f"❌ Ошибка запуска модуля {module_dir}: {e}")
		raise

def stop_module_in_container(name: str):
	"""
	Запускает модуль через docker compose внутри контейнера modules_manager,
	используя .env файл, чтобы подставить NETWORK_NAME и другие переменные.
	"""

	module_dir = os.path.join(MODULES_DIR, name)

	env = update_env_var_to_local("CONFIGURATE_DIR", os.path.join(CONFIGURATE_DIR, name))
	compose_file = os.path.join(module_dir, "docker-compose.yml")
	if not os.path.exists(compose_file):
		raise FileNotFoundError(f"docker-compose.yml не найден в {module_dir}")

	cmd = [
		"docker", "compose",
		"--env-file", env,
		"-f", compose_file,
		"stop"
		]

	try:
		subprocess.run(cmd, cwd=module_dir, check=True)
		print(f"✅ Модуль {module_dir} остановлен")
	except subprocess.CalledProcessError as e:
		print(f"❌ Ошибка остановки модуля {module_dir}: {e}")
		raise
