import os
import shutil
import logging
from app.configuration.settings import BASE_DIR, MODULES_DIR

# Настройка логирования
logger = logging.getLogger(__name__)

def move_images_to_media(img_dir, media_dir):
    if not os.path.isdir(img_dir):
        logger.warning(f"Папка {img_dir} не существует.")
        return
    
    if not os.path.isdir(media_dir):
        logger.info(f"Папка {media_dir} не существует. Создаем её.")
        os.makedirs(media_dir)

    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp')

    for filename in os.listdir(img_dir):
        file_path = os.path.join(img_dir, filename)
        
        if os.path.isfile(file_path) and filename.lower().endswith(image_extensions):
            new_path = os.path.join(media_dir, filename)
            
            try:
                shutil.copy2(file_path, new_path)
                logger.info(f"Файл {filename} перемещен в {media_dir}")
            except Exception as e:
                logger.error(f"Ошибка при перемещении файла {filename}: {e}")

def get_img(base_dir):
    return os.path.join(base_dir, "img")

def init_images(module_name):
    module_img_dir = os.path.join(BASE_DIR, *module_name.split('.'), 'img')
    if not os.path.isdir(module_img_dir):
        return 
    module_subdir = module_name.split('.')[-1]  # Получаем последнее слово из module_name
    module_media_dir = os.path.join(MODULES_DIR, module_subdir)
    move_images_to_media(module_img_dir, module_media_dir)
