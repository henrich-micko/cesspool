# Generated by Django 4.0.7 on 2022-09-30 18:10

from django.db import migrations, models
import machine.validators


class Migration(migrations.Migration):

    dependencies = [
        ('machine', '0024_alter_machine_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='code',
            field=models.CharField(max_length=10, unique=True, validators=[machine.validators.validate_machine_code]),
        ),
    ]
