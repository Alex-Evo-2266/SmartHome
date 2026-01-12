from app.db.models.device.device import Value
from app.schemas.device.device import ValueSerializeStorysSchema

import logging

logger = logging.getLogger(__name__)

def value_serialize(value:Value):
    return ValueSerializeStorysSchema(id=value.id, value=value.value, datatime=value.datatime, status=value.status_device)