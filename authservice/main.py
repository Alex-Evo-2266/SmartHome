# from db import database, metadata, engine
from tortoise.contrib.fastapi import register_tortoise
from api import auth_router

from fastapi import FastAPI

import ormar

app = FastAPI()

register_tortoise(
    app,
    db_url='mysql://roothome:123456@127.0.0.1:3306/auth_service',
    modules={'models':['src.models',"aerich.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)

app.include_router(auth_router)
