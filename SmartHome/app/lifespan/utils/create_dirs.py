import os
from app.bootstrap.const import MODULES_DIR, CONFIG_DIR, AUTOMATION_DIR

def ensure_directory_exists(directory):
    """Проверяет, существует ли директория, и если нет — создает её."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Директория {directory} создана.")
    else:
        print(f"Директория {directory} уже существует.")

def create_directorys():
    ensure_directory_exists(MODULES_DIR)
    ensure_directory_exists(CONFIG_DIR)
    ensure_directory_exists(AUTOMATION_DIR)