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
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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