from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response


class MultipleFieldLookupMixin:
    lookup_fields = ["pk"]

    def get_object(self):
        queryset = self.get_queryset()             
        queryset = self.filter_queryset(queryset)  

        kwargs_keys = self.kwargs.keys()
        filter = {
            field: self.kwargs[field]
            for field in self.lookup_fields
            if field in kwargs_keys
        }
        
        return get_object_or_404(queryset, **filter)


class RestoreModelMixin:

    def restore(self, request, **kwargs):
        instance = self.get_object()
        instance.delete_at = None
        instance.save()
        
        sz = self.serializer_class(instance = instance)
        return Response(sz.data, status = status.HTTP_200_OK)
    

class CreateModelWithCreatedByFieldMixin(CreateModelMixin):
    
    def perform_create(self, serializer):        
        instance = serializer.save()
        instance.created_by = self.request.user
        instance.save()