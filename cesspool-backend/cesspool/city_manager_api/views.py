from rest_framework.generics import ListAPIView, RetrieveAPIView
from cesspool.city_manager_api.mixins import CesspoolCityManagerMixins


class ListCesspoolAPIView(CesspoolCityManagerMixins, ListAPIView):
    pass

list_cesspool_api_view = ListCesspoolAPIView.as_view()


class RetrieveCesspoolAPIView(CesspoolCityManagerMixins, RetrieveAPIView):
    pass

retrieve_cesspool_api_view = RetrieveCesspoolAPIView.as_view()