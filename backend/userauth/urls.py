from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import RegisterView, LogoutView, ForgotPasswordView, VerifyOTPAndResetPasswordView, CustomLoginView, GoogleLoginJWTView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # Token views
    path('login/', CustomLoginView.as_view(), name='custom_login'),  # 👈 use this
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', VerifyOTPAndResetPasswordView.as_view(), name='reset_password'),

    path('google/token/', GoogleLoginJWTView.as_view(), name='google-jwt'),


]
