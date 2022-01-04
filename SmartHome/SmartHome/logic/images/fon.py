import logging

from typing import Optional, List

from SmartHome.models import User,MenuElement
from SmartHome.schemas.user import ImageBackgroundSchema

logger = logging.getLogger(__name__)

async def getBackgroundUser(id: int):
    user = await User.objects.get_or_none(id=id)
    if not user:
        logger.error(f"none user")
        return None
    backgrounds = await user.background.all()
    backgroundsUser = list()
    for item in backgrounds:
        backgroundsUser.append(ImageBackgroundSchema(
            id=item.id,
            title=item.title,
            image=item.image,
            type=item.type,
        ))
    return backgroundsUser
