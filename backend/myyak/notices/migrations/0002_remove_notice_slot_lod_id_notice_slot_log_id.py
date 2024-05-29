# Generated by Django 5.0.1 on 2024-02-07 10:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cases', '0001_initial'),
        ('notices', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notice',
            name='slot_lod_id',
        ),
        migrations.AddField(
            model_name='notice',
            name='slot_log_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cases.slotlog'),
        ),
    ]
