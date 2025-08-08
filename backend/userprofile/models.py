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
