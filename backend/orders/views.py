from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now, timedelta
from .models import Order, OrderItem
from products.models import Product
from .serializers import OrderSerializer

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = request.data.get("items", [])
        payment_method = request.data.get("payment_method")

        if not cart_items:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        total = 0
        order = Order.objects.create(
            user=request.user,
            total=0,
            payment_method=payment_method,
            estimated_delivery=now() + timedelta(days=3),
            status="Confirmed"
        )

        for item in cart_items:
            try:
                product = Product.objects.get(product_id=item["product_id"])
            except Product.DoesNotExist:
                return Response({"error": f"Product {item['product_id']} not found"}, status=status.HTTP_400_BAD_REQUEST)

            price_after_discount = product.mrp - (product.mrp * product.discount / 100)
            OrderItem.objects.create(order=order, product=product, qty=item["qty"], price=price_after_discount)
            total += price_after_discount * item["qty"]

            # Reduce stock
            product.available_stock -= item["qty"]
            product.save()

        order.total = total
        order.save()

        return Response({"message": "Order placed successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)


class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data)
