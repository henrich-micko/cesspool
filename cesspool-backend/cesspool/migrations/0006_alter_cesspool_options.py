# Generated by Django 4.1.7 on 2023-03-19 13:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cesspool', '0005_alter_cesspool_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cesspool',
            options={'permissions': [['related_to_cesspool', 'Can be related to the cesspool'], ['manage_cesspool', 'Can manage cesspools']]},
        ),
    ]
