# Generated by Django 4.1.7 on 2023-03-11 16:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cesspool', '0002_cesspoolnotrespondingproblem_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='InviteUserToCesspool',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_accepted', models.BooleanField(default=False)),
                ('cesspool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cesspool.cesspool')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'cesspool')},
            },
        ),
    ]
