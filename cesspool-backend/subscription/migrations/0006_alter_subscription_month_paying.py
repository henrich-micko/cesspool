# Generated by Django 4.1.7 on 2023-03-18 23:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscription', '0005_rename_change_part_subscription_change_parts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='month_paying',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
    ]