# cart/urls.py
from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView, RemoveFromCartView

urlpatterns = [
    path("", CartView.as_view(), name="view-cart"),
    path("add/", AddToCartView.as_view(), name="add-to-cart"),
    path("update/<int:item_id>/", UpdateCartItemView.as_view(), name="update-cart-item"),
    path("remove/<int:item_id>/", RemoveFromCartView.as_view(), name="remove-cart-item"),
]
