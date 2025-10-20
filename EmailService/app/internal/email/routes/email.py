import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.configuration.settings import ROUTE_PREFIX
from app.internal.email.schemas.email import MessageSchemas
from app.pkg import auth_privilege_dep
from app.internal.email.logic.email import send_email

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=ROUTE_PREFIX,
	tags=["send"],
	responses={404: {"description": "Not found"}},
)

@router.post("/send")
async def send(data:MessageSchemas, userId: str = Depends(auth_privilege_dep('email_send'))):
	try:
		await send_email(data.subject, data.email, data.message)
		return 'ok'
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))
