import shortuuid.django_fields
from django.db import migrations, models

def generate_order_ids(apps, schema_editor):
    Order = apps.get_model('orders', 'Order')
    for order in Order.objects.filter(order_id__isnull=True):
        order.order_id = shortuuid.ShortUUID().random(length=17)
        order.save()

class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        # Step 1: Add nullable order_id (allows NULL initially)
        migrations.AddField(
            model_name='order',
            name='order_id',
            field=shortuuid.django_fields.ShortUUIDField(
                alphabet='1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                length=17,
                max_length=20,
                prefix='id_',
                unique=True,
                null=True,  # allow null for now
                blank=True,
            ),
        ),

        # Step 2: Alter payment_method field (your existing change)
        migrations.AlterField(
            model_name='order',
            name='payment_method',
            field=models.CharField(default='COD', max_length=50),
        ),

        # Step 3: Populate order_id for existing orders
        migrations.RunPython(generate_order_ids),

        # Step 4: Make order_id non-nullable
        migrations.AlterField(
            model_name='order',
            name='order_id',
            field=shortuuid.django_fields.ShortUUIDField(
                alphabet='1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                length=17,
                max_length=20,  # increase this from 17 to 20
                prefix='id_',
                unique=True,
                null=False,  # now enforce NOT NULL
                blank=False,
            ),
        ),
    ]
