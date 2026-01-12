# app/ingternal/logs/setup.py
import logging
from app.pkg.logger.handler_factory import build_file_handler
from app.bootstrap.settings import LOGS_LEVEL

def setup_logging():
    root = logging.getLogger("app")
    root.setLevel(LOGS_LEVEL)
    root.propagate = False

    # root handler (fallback)
    if not root.handlers:
        root.addHandler(build_file_handler("app"))
