from models import User,genId,MenuElement, LocalImage
from typing import Optional, List
from schemas.user import ImageBackgroundSchema
import logging

logger = logging.getLogger(__name__)

async def getBackgroundUser(id: int):
    user = await User.objects.get_or_none(id=id)
    if not user:
        logger.error(f"none user")
        return None
    backgrounds = await user.background.all()
    backgroundsUser = list()
    for item in backgrounds:
        image = await LocalImage.objects.get_or_none(id=item.image.id)
        backgroundsUser.append(ImageBackgroundSchema(
            id=image.id,
            title=image.title,
            image=image.image,
            type=item.type,
        ))
    return backgroundsUser
