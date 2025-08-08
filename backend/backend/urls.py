"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response

# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
# from dj_rest_auth.registration.views import SocialLoginView

# class GoogleLogin(SocialLoginView):
#     adapter_class = GoogleOAuth2Adapter
#     client_class = OAuth2Client
#     callback_url = "http://localhost:5173"  # Frontend URL after auth

urlpatterns = [

    path('admin/', admin.site.urls),
    
    # dj-rest-auth URLs
    # path('auth/', include('dj_rest_auth.urls')),  # login/logout/password reset
    # path('auth/registration/', include('dj_rest_auth.registration.urls')),  # signup
    # path('auth/social/', include('allauth.socialaccount.urls')),  # Google OAuth

    # path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    # path("auth/", include("allauth.urls")),


    path('api/', include('userauth.urls')),
    path('api/', include('userprofile.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)