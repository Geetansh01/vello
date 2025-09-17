from django.contrib import admin
from .models import CartItem

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        "cart_item_id",
        "user",
        "product",
        "quantity",
        "total_price",
    )
    list_filter = ("user",)
    search_fields = (
        "cart_item_id",
        "user__username",
        "product__name",
    )
    readonly_fields = ("total_price",)
    ordering = ("user", "product")

    def total_price(self, obj):
        return obj.total_price()
    total_price.short_description = "Total Price"
