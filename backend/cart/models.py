# cart/models.py
from django.db import models
from django.conf import settings
from products.models import Product
from shortuuid.django_fields import ShortUUIDField

class CartItem(models.Model):
    cart_item_id = ShortUUIDField(unique=True, length=17, max_length=17, alphabet="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("user", "product")

    def total_price(self):
        return round(self.product.discounted_price() * self.quantity, 2)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"
