from app.ingternal.device.models.device import Value
from app.ingternal.device.schemas.device import ValueSerializeStorysSchema

import logging

logger = logging.getLogger(__name__)

def value_serialize(value:Value):
    return ValueSerializeStorysSchema(id=value.id, value=value.value, datatime=value.datatime)