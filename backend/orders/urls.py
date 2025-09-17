from django.urls import path
from .views import CreateOrderView, UserOrdersView, OrderDetailView, CancelOrderView

urlpatterns = [
    path("orders/create/", CreateOrderView.as_view(), name="create-order"),
    path("orders/", UserOrdersView.as_view(), name="user-orders"),
    path("orders/<str:order_id>/", OrderDetailView.as_view(), name="order-detail"),
    path("orders/<int:order_id>/cancel/", CancelOrderView.as_view(), name="cancel-order"),

]