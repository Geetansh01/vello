from rest_framework import serializers
from .models import (
    Product, ProductImage, ProductBenefit, ProductSuitableFor,
    ProductDosage, ProductCaution, ProductSideEffect, ProductKeyIngredient
)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["stream_url", "download_url", "uploaded_at"]

# For home/product listing
class ProductListSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)  # include images here too

    class Meta:
        model = Product
        fields = [
            "product_id", "slug", "name", "company",
            "disease_category", "mrp", "discount", "discounted_price",
            "images", "trending"
        ]

    def get_discounted_price(self, obj):
        return round(obj.discounted_price(), 2)


class ProductDetailSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    # Related fields as lists of strings
    benefits = serializers.SerializerMethodField()
    suitable_for = serializers.SerializerMethodField()
    dosage = serializers.SerializerMethodField()
    cautions = serializers.SerializerMethodField()
    side_effects = serializers.SerializerMethodField()
    key_ingredients = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "product_id", "slug", "name", "company", "disease_category",
            "mrp", "discount", "discounted_price", "images", "trending",
            "description", "available_stock", "returnable", "expiry_date",
            "directions_for_use", "seller_information", "manufactured_by", "packed_by",
            "benefits", "suitable_for", "dosage", "cautions", "side_effects", "key_ingredients"
        ]
        read_only_fields = ["product_id", "discounted_price", "images"]

    def get_discounted_price(self, obj):
        return obj.discounted_price()

    def _get_text_list(self, obj, attr):
        return [item.text for item in getattr(obj, attr).all()]

    def get_benefits(self, obj):
        return self._get_text_list(obj, 'benefits')

    def get_suitable_for(self, obj):
        return self._get_text_list(obj, 'suitable_for')

    def get_dosage(self, obj):
        return self._get_text_list(obj, 'dosage')

    def get_cautions(self, obj):
        return self._get_text_list(obj, 'cautions')

    def get_side_effects(self, obj):
        return self._get_text_list(obj, 'side_effects')

    def get_key_ingredients(self, obj):
        return self._get_text_list(obj, 'key_ingredients')


# For related products
class RelatedProductSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)  # include images here as well

    class Meta:
        model = Product
        fields = [
            "product_id", "slug", "name", "company",
            "mrp", "discount", "discounted_price", "images"
        ]

    def get_discounted_price(self, obj):
        return round(obj.discounted_price(), 2)
