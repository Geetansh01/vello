# products/urls.py
from django.urls import path
from .views import ProductListView, ProductDetailView, RelatedProductsView , ProductDetailByIDView

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("products/<slug:slug>/related/", RelatedProductsView.as_view(), name="related-products"),
    path("products/by-id/<str:product_id>/", ProductDetailByIDView.as_view(), name="product-detail-by-id"),

]
