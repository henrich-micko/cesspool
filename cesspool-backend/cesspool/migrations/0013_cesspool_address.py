# Generated by Django 4.1.7 on 2023-04-26 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cesspool', '0012_rename_battery_volt_record_battery_voltage'),
    ]

    operations = [
        migrations.AddField(
            model_name='cesspool',
            name='address',
            field=models.CharField(default=None, max_length=30, null=True),
        ),
    ]
