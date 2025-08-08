from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'phone', 'active_time')
    search_fields = ('user__email', 'name', 'phone')
    readonly_fields = ('active_time',)  # optional if you don't want admin to edit active_time

    # Optional: display email instead of user object directly
    def user_email(self, obj):
        return obj.user.email
    user_email.admin_order_field = 'user__email'
    user_email.short_description = 'User Email'
