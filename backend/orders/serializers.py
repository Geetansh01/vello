# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductListSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer()

    class Meta:
        model = OrderItem
        fields = ["product", "qty", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    can_cancel = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "order_id",  # use this instead of "id"
            "user", "total", "status", "payment_method",
            "created_at", "estimated_delivery", "items", "can_cancel"
        ]
        read_only_fields = ["order_id", "user", "created_at", "estimated_delivery", "total"]

    def get_can_cancel(self, obj):
        return obj.status in ["Pending", "Confirmed"]
