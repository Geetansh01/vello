from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import CartItem
from products.models import Product
from .serializers import CartItemSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer  # Added serializer_class

    def get(self, request):
        items = CartItem.objects.filter(user=request.user)
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # No serializer needed here

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        product = get_object_or_404(Product, product_id=product_id)

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user, product=product
        )

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"message": f"{product.name} added to cart"}, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # No serializer needed here

    def put(self, request, item_id):
        cart_item = get_object_or_404(CartItem, cart_item_id=item_id, user=request.user)

        if "quantity" not in request.data:
            return Response({"error": "Quantity field is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(request.data.get("quantity"))
        except (ValueError, TypeError):
            return Response({"error": "Quantity must be a valid integer"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity < 1:
            return Response({"error": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = quantity
        cart_item.save()
        return Response({"message": "Cart item updated"}, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # No serializer needed here

    def delete(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
        cart_item.delete()
        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)
