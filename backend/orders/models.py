# orders/models.py
from django.db import models
from django.conf import settings
from products.models import Product
from shortuuid.django_fields import ShortUUIDField


class Order(models.Model):
    order_id = ShortUUIDField(unique=True, length=17, max_length=17, prefix="id_", alphabet="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Shipped", "Shipped"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    payment_method = models.CharField(max_length=50, default="COD")
    created_at = models.DateTimeField(auto_now_add=True)
    estimated_delivery = models.DateTimeField()
    

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # after discount

    def __str__(self):
        return f"{self.product.name} x {self.qty}"
