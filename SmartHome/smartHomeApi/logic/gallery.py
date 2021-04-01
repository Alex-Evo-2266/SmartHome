from ..models import LocalImage,set_to_list_dict

def getFonUrl(oldindex):
    images = LocalImage.objects.all()
    images2 = images[oldindex:oldindex+10]
    end=True
    if(len(images)>oldindex+10):
        end=False
    for item in images2:
        users = item.imagebackground_set.all()
        print(users)
    dictImeges = set_to_list_dict(images2)
    print(dictImeges)
    ret = {"images":dictImeges,"end":end}
    return ret

def deleteImage(id):
    try:
        image = LocalImage.objects.get(id=id)
        image.delete()
        return True
    except Exception as e:
        return False
