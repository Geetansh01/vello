# products/urls.py
from django.urls import path
from .views import ProductListView, ProductDetailView, RelatedProductsView

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("products/<slug:slug>/related/", RelatedProductsView.as_view(), name="related-products"),
]
