# cart/urls.py
from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView, RemoveFromCartView

urlpatterns = [
    path("cart/", CartView.as_view(), name="view-cart"),
    path("cart/add/", AddToCartView.as_view(), name="add-to-cart"),
    path("cart/update/<str:item_id>/", UpdateCartItemView.as_view(), name="update-cart-item"),
    path("cart/remove/<str:item_id>/", RemoveFromCartView.as_view(), name="remove-cart-item"),
]
