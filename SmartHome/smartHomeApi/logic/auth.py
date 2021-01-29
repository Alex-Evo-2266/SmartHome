from django.conf import settings
import jwt

def auth(request):
    head = request.headers["Authorization"]
    jwtdata = head.split(" ")[1]
    data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=["HS256"])
    return data
