from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("price",)
    fields = ("product", "qty", "price")
    autocomplete_fields = ("product",)  # if you have a lot of products

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_id",
        "user",
        "total",
        "status",
        "payment_method",
        "created_at",
        "estimated_delivery",
    )
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("order_id", "user__username")
    readonly_fields = ("order_id", "created_at")
    ordering = ("-created_at",)

    inlines = [OrderItemInline]
