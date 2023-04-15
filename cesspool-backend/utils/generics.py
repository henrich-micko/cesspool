from rest_framework.generics import GenericAPIView

from utils import mixins


class RestoreModelAPIView(GenericAPIView, mixins.RestoreModelMixin):
    """
    Reset model with delete_at field 
    only for intherited from utils.models.ModelWithDeleteField
    """

    def get(self, *args, **kwargs):
        return super().restore(*args, **kwargs)

# --_-_-_=--__-_-=---_---