from fastapi import FastAPI
from sqlalchemy import create_engine
from dbtest import metadata, database, engine
from models import User
from logic.call_functions import call_functions
import asyncio
from logic.weather import updateWeather
from api.auth import router as router_auth
from api.user import router as router_user
from api.style import router as router_style
from api.device import router as router_device
from api.server import router as router_server


app = FastAPI();
# metadata.create_all(engine)
app.state.database = database


@app.on_event("startup")
async def startup() -> None:
    call_functions.subscribe("weather", updateWeather, 43200)
    database_ = app.state.database
    if not database_.is_connected:
        await database_.connect()
    loop = asyncio.get_running_loop()
    loop.create_task(call_functions.run())


@app.on_event("shutdown")
async def shutdown() -> None:
    database_ = app.state.database
    if database_.is_connected:
        await database_.disconnect()

app.include_router(router_auth)
app.include_router(router_server)
app.include_router(router_device)
app.include_router(router_style)
app.include_router(router_user)
