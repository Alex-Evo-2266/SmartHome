from django.conf import settings
import jwt
from rest_framework.response import Response


def auth(request):
    if "Authorization" in request.headers:
        head = request.headers["Authorization"]
        jwtdata = head.split(" ")[1]
        data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=["HS256"])
        if "userId" in data:
            return data
    return
