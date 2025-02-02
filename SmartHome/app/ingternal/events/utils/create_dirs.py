import os
from app.configuration.settings import MODULES_DIR

def ensure_directory_exists(directory):
    """Проверяет, существует ли директория, и если нет — создает её."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Директория {directory} создана.")
    else:
        print(f"Директория {directory} уже существует.")

def create_directorys():
    ensure_directory_exists(MODULES_DIR)
    print(MODULES_DIR)