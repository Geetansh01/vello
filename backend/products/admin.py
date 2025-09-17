from django.contrib import admin
from django import forms
from .models import (
    Product,
    ProductImage,
    ProductBenefit,
    ProductSuitableFor,
    ProductDosage,
    ProductCaution,
    ProductSideEffect,
    ProductKeyIngredient,
)
import asyncio
import httpx
from dateutil.parser import parse as parse_datetime

UPLOAD_URL = "https://image.wellmed.workers.dev/api/upload"

# Async image uploader function
async def async_upload_image(file):
    timeout = httpx.Timeout(60.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        files = {"photo": (file.name, file.read(), file.content_type)}
        response = await client.post(UPLOAD_URL, files=files)
        response.raise_for_status()
        return response.json()

# Sync wrapper to call async uploader
def upload_image(file):
    return asyncio.run(async_upload_image(file))

# Custom form for ProductImage inline to handle upload and save response
class ProductImageForm(forms.ModelForm):
    upload_image = forms.FileField(required=False, label="Upload Image")  # Made optional

    class Meta:
        model = ProductImage
        fields = []

    def save(self, commit=True):
        instance = super().save(commit=False)
        upload_file = self.cleaned_data.get("upload_image")

        if upload_file:
            result = upload_image(upload_file)
            res = result.get("result", {})
            instance.download_url = res.get("links", {}).get("download", "")
            instance.stream_url = res.get("links", {}).get("stream", "")
            uploaded_at_str = res.get("uploadedAt")
            instance.uploaded_at = parse_datetime(uploaded_at_str) if uploaded_at_str else None

        if commit:
            instance.save()
        return instance

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    form = ProductImageForm
    extra = 0
    readonly_fields = ("download_url", "stream_url", "uploaded_at")
    fields = ("upload_image", "image_type", "download_url", "stream_url", "uploaded_at")

    def has_change_permission(self, request, obj=None):
        # Allow editing to update image_type
        return True

class ProductBenefitInline(admin.TabularInline):
    model = ProductBenefit
    extra = 1

class ProductSuitableForInline(admin.TabularInline):
    model = ProductSuitableFor
    extra = 1

class ProductDosageInline(admin.TabularInline):
    model = ProductDosage
    extra = 1

class ProductCautionInline(admin.TabularInline):
    model = ProductCaution
    extra = 1

class ProductSideEffectInline(admin.TabularInline):
    model = ProductSideEffect
    extra = 1

class ProductKeyIngredientInline(admin.TabularInline):
    model = ProductKeyIngredient
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "product_id",
        "name",
        "company",
        "disease_category",
        "mrp",
        "discount",
        "available_stock",
        "is_available_status",  # <-- dynamic availability here
        "trending",
    )
    list_filter = ("company", "disease_category", "trending")
    search_fields = ("product_id", "name", "company", "slug")
    readonly_fields = ("slug",)
    ordering = ("name",)

    inlines = [
        ProductImageInline,
        ProductBenefitInline,
        ProductSuitableForInline,
        ProductDosageInline,
        ProductCautionInline,
        ProductSideEffectInline,
        ProductKeyIngredientInline,
    ]

    def is_available_status(self, obj):
        return obj.is_available
    is_available_status.boolean = True  # show icon
    is_available_status.short_description = "Available"
