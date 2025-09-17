from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now, timedelta
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from products.models import Product
from .serializers import OrderSerializer

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # No serializer used directly

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
            product = item.get("product")
            quantity = item.get("quantity", 0)

            if not product or quantity <= 0:
                return Response({"error": "Invalid product or quantity"}, status=status.HTTP_400_BAD_REQUEST)

            # Assuming product is product ID, so fetch product instance
            try:
                product_obj = Product.objects.get(product_id=product)
            except Product.DoesNotExist:
                return Response({"error": f"Product with id {product} not found."}, status=status.HTTP_400_BAD_REQUEST)

            if product_obj.available_stock < quantity:
                return Response({"error": f"Not enough stock for {product_obj.name}"}, status=400)

            OrderItem.objects.create(
                order=order,
                product=product_obj,
                qty=quantity,
                price=product_obj.discounted_price()
            )

            total += product_obj.discounted_price() * quantity

            product_obj.available_stock -= quantity
            product_obj.save()

        order.total = total
        order.save()

        return Response({"message": "Order placed successfully", "order_id": order.order_id}, status=status.HTTP_201_CREATED)


class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = self.serializer_class(orders, many=True)
        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get(self, request, order_id):
        order = get_object_or_404(Order, order_id=order_id, user=request.user)
        serializer = self.serializer_class(order)
        return Response(serializer.data)


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # No serializer directly used here

    def post(self, request, order_id):
        order = get_object_or_404(Order, order_id=order_id, user=request.user)

        if order.status in ["Shipped", "Delivered"]:
            return Response({"error": "Cannot cancel an order that is already shipped or delivered."},
                            status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get("reason", "")

        order.status = "Cancelled"
        order.cancellation_reason = reason
        order.save()

        for item in order.items.all():
            product = item.product
            product.available_stock += item.qty
            product.save()

        return Response({"message": "Order cancelled and stock restored."}, status=status.HTTP_200_OK)
