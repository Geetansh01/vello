from django.contrib import admin
from django import forms
from django.db import models
from .models import (
    Product,
    ProductBenefit,
    ProductSuitableFor,
    ProductDosage,
    ProductCaution,
    ProductSideEffect,
    ProductKeyIngredient,
)

# --------------------------
# Custom Form for Product
# --------------------------
class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = "__all__"

    # Handle images as newline-separated input
    def clean_images(self):
        data = self.cleaned_data.get("images", "")
        if isinstance(data, str):
            return [line.strip() for line in data.splitlines() if line.strip()]
        return data

# --------------------------
# Inline Models for Related Fields
# --------------------------
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

# --------------------------
# Product Admin
# --------------------------
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm

    list_display = (
        "product_id",
        "name",
        "company",
        "disease_category",
        "mrp",
        "discount",
        "available_stock",
        "trending",
    )
    list_filter = ("company", "disease_category", "trending")
    search_fields = ("product_id", "name", "company", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)

    # Show multi-line text areas in admin for JSON fields
    formfield_overrides = {
        models.JSONField: {"widget": forms.Textarea(attrs={"rows": 4, "cols": 60})},
    }

    # Include all related inlines
    inlines = [
        ProductBenefitInline,
        ProductSuitableForInline,
        ProductDosageInline,
        ProductCautionInline,
        ProductSideEffectInline,
        ProductKeyIngredientInline,
    ]
