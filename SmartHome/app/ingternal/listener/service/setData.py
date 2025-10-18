from app.configuration.settings import SERVICE_POLL
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.modules.classes.baseServiceInterface import IBaseService

def setDataService(method, properties, body):
    try:
        services:ObservableDict = servicesDataPoll.get(SERVICE_POLL)
        if isinstance(body, dict):
            for key in body:
                print("p901 ", key, body[key])
                service: IBaseService = services.get(key, None)
                if not service is None:
                    service.on_load_data(body[key])
        else:
            pass
    except Exception as e:
        print("p9234", e)
