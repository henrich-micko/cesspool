# Generated by Django 4.0.7 on 2022-09-19 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('machine', '0023_alter_machine_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='title',
            field=models.CharField(blank=True, max_length=14, null=True),
        ),
    ]
