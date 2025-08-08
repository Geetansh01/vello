from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        default_name = instance.email.split('@')[0]
        UserProfile.objects.create(
            user=instance,
            name=default_name,
            address='',
            phone=''
        )