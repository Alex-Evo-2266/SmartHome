
from fastapi import APIRouter
from app.internal.senderPoll.sender import sender_service

router = APIRouter(
	prefix="",
	responses={404: {"description": "Not found"}},
)

SERVICE_NAME = "ZigbeeService"
		
@router.get("/link")
async def link():

	await sender_service.send(SERVICE_NAME, {"zigbee2mqtt": {"command": "link", "status": True}})

	return "ok"
