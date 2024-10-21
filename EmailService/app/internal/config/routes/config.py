import logging

from app.configuration.settings import ROUTE_PREFIX, CONFIG_TAG, __config__
from app.pkg.config import ConfigItem
from typing import List, Dict

from fastapi import APIRouter, Depends

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}",
	tags=[CONFIG_TAG],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[ConfigItem])
async def get_config():
    return __config__.get_all_data()

@router.patch("")
async def set_config(data: Dict[str, str]):
    await __config__.set_dict(data)
    __config__.save()
    return "ok"