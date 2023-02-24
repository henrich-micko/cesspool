from rest_framework.generics import GenericAPIView

from utils import mixins


class RestoreModelAPIView(GenericAPIView, mixins.RestoreModelMixin):
    """
    Reset model with delete_at field 
    only for intherited from utils.models.ModelWithDeleteField
    """

    def post(self, *args, **kwargs):
        return super().restore(*args, **kwargs)

# --_-_-_=--__-_-=---_---