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

        # Inside the order creation loop
        for item in cart_items:
            product = item.product

            # Check if stock is available (optional safety check)
            if product.available_stock < item.quantity:
                return Response({"error": f"Not enough stock for {product.name}"}, status=400)

            OrderItem.objects.create(
                order=order,
                product=product,
                qty=item.quantity,
                price=product.discounted_price()
            )

            # Decrease stock
            product.available_stock -= item.quantity
            product.save()


        order.total = total
        order.save()

        return Response({"message": "Order placed successfully", "order_id": order.order_id}, status=status.HTTP_201_CREATED)


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
            order = Order.objects.get(order_id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, order_id=order_id, user=request.user)

        if order.status in ["Shipped", "Delivered"]:
            return Response({"error": "Cannot cancel an order that is already shipped or delivered."},
                            status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get("reason", "")

        # Update order status
        order.status = "Cancelled"
        order.cancellation_reason = reason
        order.save()

        # 🔄 Restore stock for each item
        for item in order.items.all():
            product = item.product
            product.available_stock += item.qty
            product.save()

        return Response({"message": "Order cancelled and stock restored."}, status=status.HTTP_200_OK)

