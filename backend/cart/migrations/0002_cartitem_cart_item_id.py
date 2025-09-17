import shortuuid.django_fields
from django.db import migrations, models

def generate_unique_ids(apps, schema_editor):
    CartItem = apps.get_model('cart', 'CartItem')
    for item in CartItem.objects.all():
        item.cart_item_id = shortuuid.uuid()[:17]  # length = 17
        item.save()

class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0001_initial'),
    ]

    operations = [
        # 1. Add the field with null=True (no unique yet)
        migrations.AddField(
            model_name='cartitem',
            name='cart_item_id',
            field=shortuuid.django_fields.ShortUUIDField(
                alphabet='1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                length=17,
                max_length=17,
                prefix='',
                null=True,
                unique=False,  # temporarily not unique
            ),
        ),

        # 2. Populate existing rows with unique IDs
        migrations.RunPython(generate_unique_ids),

        # 3. Alter field to make it unique and non-nullable
        migrations.AlterField(
            model_name='cartitem',
            name='cart_item_id',
            field=shortuuid.django_fields.ShortUUIDField(
                alphabet='1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                length=17,
                max_length=17,
                prefix='',
                null=False,
                unique=True,
            ),
        ),
    ]
