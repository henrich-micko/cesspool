# Generated by Django 4.1.7 on 2023-04-15 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cesspool', '0006_alter_cesspool_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='cesspool',
            name='demo_mode',
            field=models.BooleanField(default=False),
        ),
    ]