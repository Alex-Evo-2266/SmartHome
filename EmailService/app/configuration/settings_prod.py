import os

DEBUG = True

EMAIL_TOPIK = os.environ.get("EMAIL_TOPIK")
EMAIL_QUEUE = os.environ.get("EMAIL_QUEUE")

RABITMQ_HOST = os.environ.get("RABITMQ_HOST")
RABITMQ_PORT = os.environ.get("RABITMQ_PORT")