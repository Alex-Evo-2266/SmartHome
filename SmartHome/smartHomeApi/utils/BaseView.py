from rest_framework.views import APIView
# from rest_framework.response import Response
from rest_framework.exceptions import APIException
import logging, json
from django.http import HttpRequest

logger = logging.getLogger(__name__)

class BaseView(APIView):
    """docstring for BaseView."""

    def dispatch(self, request, *args, **kwargs):
        try:
            response = super().dispatch(request, *args, **kwargs)
        except Exception as e:
            logger.error(f'unknown error. detail:{e}')
            return self._response(json.dumps({"detail":e}),status=400)

        return response

    @staticmethod
    def _response(data, *, status=200):
        return HttpRequest(
            data,
            status=status,
            safe=not isinstance(data, list),
            # json_dumps_params=JSON_DUMPS_PARAMS
        )
