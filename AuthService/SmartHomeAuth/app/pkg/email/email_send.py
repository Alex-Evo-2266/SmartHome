from app.pkg.rabitmq import publisher
from app.configuration.settings import EMAIL_QUEUE, RABITMQ_HOST
from pydantic import BaseModel
from typing import Optional
import logging

class EmailSendSchema(BaseModel):
    to_email: str
    message: str
    title: str

logger = logging.getLogger(__name__)

def send_email(data: EmailSendSchema):
    try:
        publisher.publish(data.dict())
    except Exception as e:
        logger.warning("error send email")

def email_connect():
	publisher.connect(RABITMQ_HOST, EMAIL_QUEUE)

def email_desconnect():
	publisher.stop()