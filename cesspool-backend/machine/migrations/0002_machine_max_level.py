# Generated by Django 4.0.6 on 2022-07-30 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('machine', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='machine',
            name='max_level',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]