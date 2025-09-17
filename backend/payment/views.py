import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from orders.models import Order
from .models import Payment

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        order_id = request.query_params.get("order_id")
        if not order_id:
            return Response({"error": "order_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        DATA = {
            "amount": int(order.total * 100),  # amount in paise
            "currency": "INR",
            "receipt": order.order_id,
            "payment_capture": 1,
        }

        try:
            razorpay_order = razorpay_client.order.create(data=DATA)
        except razorpay.errors.RazorpayError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        Payment.objects.create(
            order=order,
            razorpay_order_id=razorpay_order["id"]
        )

        return Response({
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key_id": settings.RAZORPAY_KEY_ID,
            "amount": DATA["amount"],
            "currency": "INR",
        })


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_payment(request):
    data = request.data

    try:
        order = Order.objects.get(order_id=data.get("order_id"))
        payment = Payment.objects.get(order=order)

        params_dict = {
            "razorpay_order_id": data.get("razorpay_order_id"),
            "razorpay_payment_id": data.get("razorpay_payment_id"),
            "razorpay_signature": data.get("razorpay_signature"),
        }

        result = razorpay_client.utility.verify_payment_signature(params_dict)

        if result is None:
            payment.razorpay_payment_id = params_dict["razorpay_payment_id"]
            payment.razorpay_signature = params_dict["razorpay_signature"]
            payment.paid = True
            payment.save()

            order.status = "Confirmed"
            order.save()

            return Response({"status": "Payment verified successfully"})
        else:
            return Response({"status": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    except Payment.DoesNotExist:
        return Response({"error": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)
    except razorpay.errors.SignatureVerificationError:
        return Response({"error": "Signature verification failed"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
