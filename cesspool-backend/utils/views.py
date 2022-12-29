from rest_framework import status
from rest_framework.views import APIView, Response

from django.shortcuts import get_object_or_404


class RsModelAPIView(APIView):
    """
    Reset model with delete_at field (intherited from utils.models.ModelWithDeleteField)
    Easy to use - rewrite model with table u wane get query set from ( model.objects.all )
    Its writen this way becaus if we would have qeuryset var instend of model
    there would be store lots of instance all the time

    if will get object by post parms from url ( kwargs )

    """

    model = None
    serializer = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        if self.model == None or self.serializer == None:
            raise ValueError("Model and Serializer is set to None")

    def post(self, request, **kwargs):
        instance = get_object_or_404(self.model.objects.all(), **kwargs)
        instance.delete_at = None
        instance.save()
        
        sz = self.serializer(instance = instance)
        return Response(sz.data, status = status.HTTP_200_OK)