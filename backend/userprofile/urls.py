from django.urls import path
from .views import *

urlpatterns = [
    path('me/', GetProfileView.as_view(), name='get_profile'),
    path('status/', ProfileStatusView.as_view(), name='profile_status'),
    path('update/', UpdateProfileView.as_view(), name='update_profile'),
    path('delete/', DeleteProfileView.as_view(), name='delete_profile'),
    path('active-time/', ActiveTimeView.as_view(), name='active_time'),
]