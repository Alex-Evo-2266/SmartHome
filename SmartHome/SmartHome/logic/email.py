import yaml, smtplib
import logging

from SmartHome import settings

logger = logging.getLogger(__name__)

async def send_email(subject, to_email, message):
    """
    Send an email
    """
    try:
        templates = None
        with open(settings.SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        acaunt = templates["email"]
        from_email = acaunt["login"]
        password = acaunt["password"]
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
        logger.error(f"error send email. detail: {e}")
