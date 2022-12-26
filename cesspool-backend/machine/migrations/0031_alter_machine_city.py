# Generated by Django 4.1.4 on 2022-12-26 19:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("location", "0001_initial"),
        ("machine", "0030_machine_city"),
    ]

    operations = [
        migrations.AlterField(
            model_name="machine",
            name="city",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="location.city",
            ),
        ),
    ]
