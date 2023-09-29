import yaml, smtplib
import logging
from app.exceptions.exceptions import NoConfigurationDataException

from app import settings

logger = logging.getLogger(__name__)

async def send_email(subject, to_email, message):
    """
    Send an email
    """
    logger.debug(f"send email input param. subject: {subject}, to_email: {to_email}, message: {message}")

    try:
        email_data = settings.configManager.getConfig("email")
        if not email_data:
            raise NoConfigurationDataException("email config not found")
        from_email = email_data["login"]
        password = email_data["password"]
        if(from_email == '' or password == ''):
            logger.warning("no login or password from email")
            return

        BODY = "\r\n".join((
            "From: %s" % from_email,
            "To: %s" % to_email,
            "Subject: %s" % subject ,
            "",
            message
        ))
        server = smtplib.SMTP_SSL('smtp.mail.ru')
        server.login(from_email,password)
        server.sendmail(from_email,to_email,BODY)
        server.quit()
    except Exception as e:
        logger.warning(f"error send email. detail: {e}")
