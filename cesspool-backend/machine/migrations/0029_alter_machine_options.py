# Generated by Django 4.1.4 on 2022-12-11 22:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("machine", "0028_remove_machine_user"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="machine",
            options={"permissions": [("own_machine", "Can own machine")]},
        ),
    ]
