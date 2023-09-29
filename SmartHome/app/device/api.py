import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.device.models import Device, Device_field
from app.authtorization.auth_depends import token_dep
from app.device.schemas import AddDeviceSchema


router = APIRouter(
	prefix="/api/devices",
	tags=["device"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.post("")
async def add_device_url(data:AddDeviceSchema):
	try:
		new_device = await Device.objects.create(**(data.dict()))
		new_device.save()
		for field in data.fields:
			new_field = await Device_field.objects.create(**(field.dict()), device=new_device)
			new_field.save()
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))