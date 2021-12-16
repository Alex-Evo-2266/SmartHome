from ..models import LocalImage,genId,set_to_list_dict,ImageBackground,UserConfig,User
import logging

logger = logging.getLogger(__name__)

def getFonUrl(oldindex):
    logger.debug(f'get image urls. input oldindex:{oldindex}')
    images = LocalImage.objects.all()
    images2 = images[oldindex:oldindex+30]
    end=True
    if(len(images)>oldindex+30):
        end=False
    for item in images2:
        users = item.imagebackground_set.all()
    dictImeges = set_to_list_dict(images2)
    ret = {"images":dictImeges,"end":end}
    return ret

def deleteImage(id):
    try:
        logger.debug(f'delete image. input id:{id}')
        image = LocalImage.objects.get(id=id)
        back = image.imagebackground_set.all()
        for item in back:
            item.delete()
        image.delete()
        return {'status':'ok'}
    except Exception as e:
        logger.error(f'error delete image. id:{id}, detail:{e}')
        return {'status':'error', 'detail':e}

def linkbackground(data,id):
    logger.debug(f'link background. input id:{id}, data:{data}')
    try:
        user = User.objects.get(id=id)
        backgrounds = user.userconfig.background.all()
        image = LocalImage.objects.get(id=data["id"])
        for item in backgrounds:
            if(item.type==data["type"]):
                item.delete()
                break
        background = ImageBackground.objects.create(id=genId(ImageBackground.objects.all()),type=data["type"],image=image)
        user.userconfig.background.add(background)
        return {'status':'ok'}
    except Exception as e:
        logger.error(f'error link image. id:{id}, data:{data}, detail:{e}')
        return {'status':'error', 'detail':e}
