# products/serializers.py
from rest_framework import serializers
from .models import Product

# For home/product listing
class ProductListSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "product_id", "slug", "name", "company",
            "disease_category", "mrp", "discount", "discounted_price",
            "images", "trending"
        ]

    def get_discounted_price(self, obj):
        return round(obj.discounted_price(), 2)


# For product detail page
class ProductDetailSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "product_id", "slug", "name", "company", "disease_category",
            "mrp", "discount", "discounted_price", "images", "trending",
            "description", "available_stock"
        ]

    def get_discounted_price(self, obj):
        return round(obj.discounted_price(), 2)


# For related products
class RelatedProductSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "product_id", "slug", "name", "company",
            "mrp", "discount", "discounted_price", "images"
        ]

    def get_discounted_price(self, obj):
        return round(obj.discounted_price(), 2)
