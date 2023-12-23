import logging
import os, filecmp, shutil
from typing import List
from app.configuration.settings import MEDIA_ROOT, BACKGROUND_DIR, MODULES_DIR, SERVER_CONFIG
from app.modules.modules import get_img_dir

logger = logging.getLogger(__name__)

async def init_dir():
    if not os.path.exists(MEDIA_ROOT):
        os.mkdir(MEDIA_ROOT)
    if not os.path.exists(MODULES_DIR):
        os.mkdir(MODULES_DIR)
    if not os.path.exists(BACKGROUND_DIR):
        os.mkdir(BACKGROUND_DIR)
    

    paths:List[str] = await get_img_dir()
    for path in paths:
        module_name = path.split(os.sep)[-1]
        module_img_media = MODULES_DIR + os.sep + module_name
        if not os.path.exists(module_img_media):
            os.mkdir(module_img_media)
        imgs:List[str] = os.listdir(path + os.sep + "img")
        print(imgs)
        for img in imgs:
            img_extension = img.split(".")[1]
            try:
                if(["png", "jpeg", "jpg"].index(img_extension) != None):
                    if not (os.path.exists(module_img_media + os.sep + img) and filecmp.cmp(path + os.sep + "img" + os.sep + img, module_img_media + os.sep + img)):
                        shutil.copyfile(path + os.sep + "img" + os.sep + img, module_img_media + os.sep + img)
            except ValueError as e:
                print(e)
