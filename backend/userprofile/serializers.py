from rest_framework import serializers
from .models import UserProfile, UserAddress


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = [
            "id",
            "recievers_name",
            "recievers_phone",
            "address_type",
            "address_line",
            "city",
            "state",
            "pincode",
            "full_address",
            "latitude",
            "longitude",
            "is_default",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_pincode(self, value):
        if not value.isdigit() or len(value) != 6:
            raise serializers.ValidationError("Pincode must be a 6-digit number.")
        return value

    def validate_recievers_phone(self, value):
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    # Show all addresses belonging to the user
    addresses = UserAddressSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "name",
            "address",
            "phone",
            "active_time",
            "addresses",
        ]
        read_only_fields = ["id", "addresses"]

    def validate_phone(self, value):
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value
