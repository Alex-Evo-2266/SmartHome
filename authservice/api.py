from fastapi import APIRouter
from schemas import LoginForm
from models import User

auth_router = APIRouter()

@auth_router.post('/login/')
def login(item: LoginForm):
    return {"input":item}

@auth_router.post('/adduser/')
async def add_user(item: User):
    await item.save()
    return item
