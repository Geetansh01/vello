from django.db import models
from shortuuid.django_fields import ShortUUIDField


class Product(models.Model):
    # Basic Info
    product_id = ShortUUIDField(unique=True, length=6, max_length=20, alphabet="1234567890")

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255)  # Brand / Company
    disease_category = models.CharField(max_length=255, blank=True, null=True)  # e.g., Diabetes, Cardiology
    returnable = models.BooleanField(default=False)
    expiry_date = models.DateField(blank=True, null=True)

    # Pricing & Stock
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(default=0)  # Percentage discount
    available_stock = models.BooleanField(default=False)

    # Media & Flags
    trending = models.BooleanField(default=False)

    # Rich Details
    description = models.TextField()  # General description
   
    directions_for_use = models.TextField(blank=True, null=True)  # long paragraph

    # Manufacturer / Seller Info
    seller_information = models.CharField(max_length=255, blank=True, null=True)
    manufactured_by = models.CharField(max_length=255, blank=True, null=True)
    packed_by = models.CharField(max_length=255, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)


    # Utility
    def discounted_price(self):
        return round(self.mrp - (self.mrp * self.discount / 100), 2)

    def __str__(self):
        return f"{self.name} ({self.company})"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    stream_url = models.URLField(max_length=500)
    download_url = models.URLField(max_length=500)
    uploaded_at = models.DateTimeField()

    def __str__(self):
        return f"Image for {self.product.name} uploaded at {self.uploaded_at}"


# --- Related Models ---

class ProductBenefit(models.Model):
    product = models.ForeignKey(Product, related_name="benefits", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - {self.text}"


class ProductSuitableFor(models.Model):
    product = models.ForeignKey(Product, related_name="suitable_for", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - {self.text}"


class ProductDosage(models.Model):
    product = models.ForeignKey(Product, related_name="dosage", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - {self.text}"


class ProductCaution(models.Model):
    product = models.ForeignKey(Product, related_name="cautions", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - {self.text}"


class ProductSideEffect(models.Model):
    product = models.ForeignKey(Product, related_name="side_effects", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - {self.text}"


class ProductKeyIngredient(models.Model):
    product = models.ForeignKey(Product, related_name="key_ingredients", on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - {self.text}"