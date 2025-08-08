from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    user_uuid = serializers.CharField(source='user.user_uuid', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user_uuid','name', 'address', 'phone']
