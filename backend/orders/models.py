# orders/models.py
from django.db import models
from django.conf import settings
from products.models import Product
from shortuuid.django_fields import ShortUUIDField


from django.utils import timezone
from datetime import timedelta

class Order(models.Model):
    order_id = ShortUUIDField(unique=True, length=17, max_length=17, prefix="id_", alphabet="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Shipped", "Shipped"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]

    DELIVERY_METHOD_CHOICES = [
        ("Local", "Local"),
        ("Partner", "Delivery Partner"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    payment_method = models.CharField(max_length=50, default="COD")
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHOD_CHOICES, blank=True)
    estimated_delivery = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    delivery_otp = models.CharField(max_length=6, blank=True, null=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.user.username}"

    def set_delivery_details(self, user_pincode):
        if user_pincode == "110040":
            self.delivery_method = "Local"
            self.estimated_delivery = timezone.now() + timedelta(hours=24)
        else:
            self.delivery_method = "Partner"
            self.estimated_delivery = timezone.now() + timedelta(hours=72)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # after discount

    def __str__(self):
        return f"{self.product.name} x {self.qty}"
