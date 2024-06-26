from django.urls import path
from cesspool.admin_api import views


urlpatterns = [
    path("", views.list_cesspool_api_view, name = "cesspool-admin-list"),
    path("code", views.generate_cesspool_code_api_view, name = "cesspool-code-generate"),
    path("create", views.create_cesspool_api_view, name = "cesspool-admin-create"),
    path("c/<str:code>", views.rud_cesspool_api_view, name = "cesspool-admin-rud"),
    path("c/<str:code>/restore", views.restore_cesspool_api_view, name = "cesspool-admin-restore"),
    path("c/<str:code>/records/generate", views.generate_debug_records_api_view, name = "cesspool-records-generate"),
]