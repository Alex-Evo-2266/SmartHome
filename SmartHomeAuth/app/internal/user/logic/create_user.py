import logging, bcrypt

from uuid import uuid4

from app.configuration.settings import BASE_ROLE

from app.internal.user.schemas.user import UserForm
from app.internal.user.exceptions.user import UserAlreadyExistsException
from app.internal.user.models.user import User
from app.internal.user.logic.get_user import get_user

from app.internal.role.logic.get_role import get_role

from app.pkg.email import send_email, EmailSendSchema

logger = logging.getLogger(__name__)

async def get_uuid_user():
	uuid = uuid4().hex
	while (await get_user(uuid) != None):
		uuid = uuid4().hex
	return uuid

async def add_user(data: UserForm):
	try:
		uuid = await get_uuid_user()
		logger.debug(f"add user input data: {data.dict()}")
		hashedPass = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
		cond = await User.objects.get_or_none(name=data.name)
		if(cond):
			raise UserAlreadyExistsException('such user already exists')
		role = await get_role(BASE_ROLE.ADMIN)
		if(not role):
			raise Exception("error add user")
		newUser = await User.objects.create(id=uuid, name=data.name, email=data.email, password=hashedPass, role=role)
		message = "login = " + data.name + "\npassword = " + data.password
		logger.debug(f"login input data: {data.dict()}")
		send_email(EmailSendSchema(
			to_email=data.email,
			title="Account smart home",
			message=message
			))
		return newUser
	except Exception as e:
		logger.error(f"error add user: {e}")
		raise
	
