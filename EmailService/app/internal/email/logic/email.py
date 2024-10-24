import smtplib
import logging

from app.pkg import __config__

logger = logging.getLogger(__name__)

async def send_email(subject, to_email, message):
    """
    Send an email
    """
    logger.debug(f"send email input param. subject: {subject}, to_email: {to_email}, message: {message}")

    try:
        from_email = __config__.get("email").value
        password = __config__.get("password").value
        if not from_email or not password:
            raise Exception("email config not found")

        BODY = "\r\n".join((
            "From: %s" % from_email,
            "To: %s" % to_email,
            "Subject: %s" % subject ,
            "",
            message
        ))
        server = smtplib.SMTP_SSL('smtp.mail.ru')
        server.login(from_email,password)
        server.sendmail(from_email,to_email, BODY)
        server.quit()
    except Exception as e:
        logger.warning(f"error send email. detail: {e}")
