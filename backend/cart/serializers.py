# cart/serializers.py
from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductListSerializer
from drf_spectacular.utils import extend_schema_field
from decimal import Decimal

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["cart_item_id", "product", "quantity", "total_price"]

    @extend_schema_field(serializers.DecimalField(max_digits=10, decimal_places=2))
    def get_total_price(self, obj) -> Decimal:
        return obj.total_price()