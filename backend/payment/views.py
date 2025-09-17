import razorpay
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from orders.models import Order
from .models import Payment

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_order(request):
    # You’d validate user and get Order info dynamically in a real project
    order_id = request.GET.get("order_id")
    order = Order.objects.get(order_id=order_id)

    DATA = {
        "amount": int(order.total * 100),  # Razorpay expects amount in paise
        "currency": "INR",
        "receipt": order.order_id,
        "payment_capture": 1,
    }

    razorpay_order = razorpay_client.order.create(data=DATA)

    # Save to DB
    Payment.objects.create(
        order=order,
        razorpay_order_id=razorpay_order["id"]
    )

    return JsonResponse({
        "razorpay_order_id": razorpay_order["id"],
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
        "amount": DATA["amount"],
        "currency": "INR",
    })

@csrf_exempt
def verify_payment(request):
    if request.method == "POST":
        data = request.POST

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

                return JsonResponse({"status": "Payment verified successfully"})
            else:
                return JsonResponse({"status": "Payment verification failed"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return HttpResponseBadRequest("Invalid request")
