from fastapi import FastAPI
from sqlalchemy import create_engine
from dbtest import metadata, database, engine
from models import User
from api.auth import router as router_auth
from api.user import router as router_user

app = FastAPI();

# metadata.create_all(engine)
app.state.database = database


@app.on_event("startup")
async def startup() -> None:
    database_ = app.state.database
    if not database_.is_connected:
        await database_.connect()


@app.on_event("shutdown")
async def shutdown() -> None:
    database_ = app.state.database
    if database_.is_connected:
        await database_.disconnect()

app.include_router(router_auth)
app.include_router(router_user)
