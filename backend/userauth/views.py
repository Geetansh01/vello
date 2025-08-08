from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSignupSerializer
from userprofile.serializers import UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .utils import generate_otp
from .email import send_otp_email
from .models import PasswordResetOTP, CustomUser
from rest_framework.permissions import AllowAny
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
from django.conf import settings
import os
GOOGLE_CLIENT_ID = os.getenv("CLIENT_ID")

from userprofile.models import UserProfile

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 
    def post(self, request):
        user_serializer = UserSignupSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            # ✅ Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User created successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Clear session tracking for active time
            request.session.pop('last_seen', None)

            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]  
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            code = generate_otp()
            PasswordResetOTP.objects.create(user=user, code=code)
            send_otp_email(user.email, code)
            return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            print("Email sending failed:", str(e))
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPAndResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not all([email, otp, new_password]):
            return Response({"error": "Email, OTP, and new password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp_obj = PasswordResetOTP.objects.filter(user=user, code=otp).latest('created_at')
        except PasswordResetOTP.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Check expiration
        if timezone.now() > otp_obj.created_at + timezone.timedelta(minutes=3):
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Reset password
        user.set_password(new_password)
        user.save()

        # Clean up used OTPs
        PasswordResetOTP.objects.filter(user=user).delete()

        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    
class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # disable auth for login

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User does not exist. Please create an account."}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({"error": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)

        # User is authenticated
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)
    

class GoogleLoginJWTView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # disable auth for login

    def post(self, request):
        token = request.data.get("access_token")
        if not token:
            return Response({"error": "Token missing"}, status=400)

        try:
            # 🔐 Verify token using Google's public keys
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                GOOGLE_CLIENT_ID
            )

            email = idinfo["email"]
            given_name = idinfo.get("given_name", "")
            family_name = idinfo.get("family_name", "")

            # 👤 Get or create the user
            user, _ = CustomUser.objects.get_or_create(email=email)

            # 🧾 Create profile only if it doesn't exist
            UserProfile.objects.get_or_create(
                user=user,
                defaults={"name": f"{given_name} {family_name}"}
            )

            # 🔁 Create JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        except ValueError:
            return Response({"error": "Invalid token"}, status=400)

        except Exception as e:
            return Response({"error": str(e)}, status=500)