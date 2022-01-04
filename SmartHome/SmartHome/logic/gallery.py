from SmartHome.settings import MEDIA_ROOT, MEDIA_URL
from SmartHome.schemas.image import ImageSchema
from SmartHome.schemas.base import FunctionRespons
from typing import Optional, List, Dict
from SmartHome.models import User,ImageBackground
import os, sys
import logging

logger = logging.getLogger(__name__)

def getimageName(index: int, count: int = 10)->List[ImageSchema]:
    i = 0
    arr = []
    fileList = os.listdir(MEDIA_ROOT + "/backgrounds")
    print(fileList)
    for item in fileList:
        if (i > index + count):
            return arr
        elif (i >= index):
            arr.append(ImageSchema(
                image=MEDIA_URL + "backgrounds/" + item,
                title=item
            ))
        i = i + 1
    return arr

def backgroundDelete(name:str)->FunctionRespons:
    try:
        logger.debug(f'delete image. image:{name}')
        file_path = os.path.join(MEDIA_ROOT, "backgrounds", name)
        os.remove(file_path)
        return FunctionRespons(status="ok")
    except Exception as e:
        logger.error(f'error delete image. file:{name}. detail:{e}')
        return FunctionRespons(status="error", detail=str(e))

async def backgroundLinc(name:str, type:str, id: int)->FunctionRespons:
    try:
        logger.debug(f'linc image. image:{name}, type:{type}')
        u = await User.objects.get_or_none(id=id)
        if not u:
            logger.error(f"none user")
            return FunctionRespons(status="error", detail='none user')
        backgrounds = await u.background.all()
        for item in backgrounds:
            if item.type == type:
                await item.delete()
                break
        background = await ImageBackground.objects.create(type=type, title=name, image=os.path.join(MEDIA_URL, "backgrounds", name))
        await u.background.add(background)
        return FunctionRespons(status="ok")
    except Exception as e:
        logger.error(f'error linc image. file:{name}. detail:{e}')
        return FunctionRespons(status="error", detail=str(e))
