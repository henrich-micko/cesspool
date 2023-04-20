from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView

from location.admin_api.mixins import CityAdminMixin
from utils.generics import RestoreModelAPIView
from utils.generics import CreateModelWithCreatedByFieldAPIView


class CreateCityAPIView(CityAdminMixin, CreateModelWithCreatedByFieldAPIView):
    pass

create_city_api_view = CreateCityAPIView.as_view()


class GPDCityAPIView(CityAdminMixin, RetrieveUpdateDestroyAPIView):  
    pass

gpd_city_api_view = GPDCityAPIView.as_view()


class ListCityAPIView(CityAdminMixin, ListAPIView):
    pass

list_city_api_view = ListCityAPIView.as_view()


class RestoreCityAPIView(CityAdminMixin, RestoreModelAPIView):
    pass

restore_city_api_view = RestoreCityAPIView.as_view()