from django.urls import path
from .views import (
    GetProfileView, ProfileStatusView, UpdateProfileView,
    DeleteProfileView, ActiveTimeView,
    AddressListCreateView, AddressDetailView
)

urlpatterns = [
    # Profile endpoints
    path("me/", GetProfileView.as_view(), name="get-profile"),
    path("profile/status/", ProfileStatusView.as_view(), name="profile-status"),
    path("profile/update/", UpdateProfileView.as_view(), name="update-profile"),
    path("profile/delete/", DeleteProfileView.as_view(), name="delete-profile"),
    path("profile/active-time/", ActiveTimeView.as_view(), name="active-time"),

    # Address endpoints
    path("addresses/", AddressListCreateView.as_view(), name="list-create-address"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),
]
