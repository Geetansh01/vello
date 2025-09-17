# products/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Product
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    RelatedProductSerializer
)
from rest_framework.permissions import AllowAny


class ProductListView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ProductListSerializer
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        product = get_object_or_404(Product, slug=slug)
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProductDetailByIDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, product_id):
        product = get_object_or_404(Product, product_id=product_id)
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RelatedProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        product = get_object_or_404(Product, slug=slug)
        related_products = Product.objects.filter(
            disease_category=product.disease_category
        ).exclude(slug=slug)[:5]
        serializer = RelatedProductSerializer(related_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
