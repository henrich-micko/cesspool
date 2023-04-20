from rest_framework.generics import GenericAPIView

from utils.mixins import RestoreModelMixin, CreateModelWithCreatedByFieldMixin
from rest_framework.generics import GenericAPIView


class RestoreModelAPIView(GenericAPIView, RestoreModelMixin):
    """
    Reset model with delete_at field 
    only for intherited from utils.models.ModelWithDeleteField
    """

    def get(self, *args, **kwargs):
        return super().restore(*args, **kwargs)


# --_-_-_=--__-_-=---_---


class CreateModelWithCreatedByFieldAPIView(CreateModelWithCreatedByFieldMixin, GenericAPIView):
    """
    Create model and set logged user to created by field
    """

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)