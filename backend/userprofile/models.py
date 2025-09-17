from django.db import models
from django.conf import settings
from datetime import timedelta


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    active_time = models.DurationField(default=timedelta)

    def __str__(self):
        return self.user.email


class UserAddress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses")
    
    recievers_name = models.CharField(max_length=100)
    recievers_phone = models.CharField(max_length=15)
    address_type = models.CharField(max_length=100)  # e.g., "Home", "Office"
    address_line = models.TextField()        # Street address / Building / Area  ||   Manual OR Google
    city = models.CharField(max_length=100) # Manual OR Google
    state = models.CharField(max_length=100) # Manual OR Google
    pincode = models.CharField(max_length=6) # Manual OR Google

    full_address = models.TextField(blank=True, null=True)  # from Google Maps || Automated
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True) # from Google Maps || Automated
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True) # from Google Maps || Automated
 
    is_default = models.BooleanField(default=False) # default address for deliveries
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.address_type} - {self.user.email}"
