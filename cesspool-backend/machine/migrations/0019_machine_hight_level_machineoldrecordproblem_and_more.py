# Generated by Django 4.0.7 on 2022-09-07 17:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('machine', '0018_machinedeleterecordsaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='machine',
            name='hight_level',
            field=models.IntegerField(default=85),
        ),
        migrations.CreateModel(
            name='MachineOldRecordProblem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detail', models.CharField(default='This is problem', max_length=20)),
                ('importance', models.IntegerField(choices=[(0, 'warning'), (1, 'error')], default=(0, 'warning'))),
                ('is_sand', models.BooleanField(default=False)),
                ('machine', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='machine.machine')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MachineNoTitleProblem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detail', models.CharField(default='This is problem', max_length=20)),
                ('importance', models.IntegerField(choices=[(0, 'warning'), (1, 'error')], default=(0, 'warning'))),
                ('is_sand', models.BooleanField(default=False)),
                ('machine', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='machine.machine')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MachineNoRecordProblem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detail', models.CharField(default='This is problem', max_length=20)),
                ('importance', models.IntegerField(choices=[(0, 'warning'), (1, 'error')], default=(0, 'warning'))),
                ('is_sand', models.BooleanField(default=False)),
                ('machine', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='machine.machine')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MachineLowBatteryProblem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detail', models.CharField(default='This is problem', max_length=20)),
                ('importance', models.IntegerField(choices=[(0, 'warning'), (1, 'error')], default=(0, 'warning'))),
                ('is_sand', models.BooleanField(default=False)),
                ('machine', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='machine.machine')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MachineHightLevelProblem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detail', models.CharField(default='This is problem', max_length=20)),
                ('importance', models.IntegerField(choices=[(0, 'warning'), (1, 'error')], default=(0, 'warning'))),
                ('is_sand', models.BooleanField(default=False)),
                ('machine', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='machine.machine')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MachineDeathBatteryProblem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detail', models.CharField(default='This is problem', max_length=20)),
                ('importance', models.IntegerField(choices=[(0, 'warning'), (1, 'error')], default=(0, 'warning'))),
                ('is_sand', models.BooleanField(default=False)),
                ('machine', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='machine.machine')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
