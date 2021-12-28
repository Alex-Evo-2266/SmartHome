import asyncio

from fastapi import FastAPI
from sqlalchemy import create_engine

from castom_moduls import init_moduls

from SmartHome.dbtest import metadata, database, engine
from SmartHome.models import User
from SmartHome.logic.call_functions import call_functions
from SmartHome.logic.weather import updateWeather
from SmartHome.api.auth import router as router_auth
from SmartHome.api.user import router as router_user
from SmartHome.api.style import router as router_style
from SmartHome.api.device import router as router_device
from SmartHome.api.server import router as router_server


app = FastAPI();
# metadata.create_all(engine)
app.state.database = database


@app.on_event("startup")
async def startup() -> None:
    call_functions.subscribe("weather", updateWeather, 43200)
    init_moduls()
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
