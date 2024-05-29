# Generated by Django 5.0.1 on 2024-02-12 05:29

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medicines', '0008_alter_medicine_med_barcode'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Used',
            fields=[
                ('used_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('used_reg_dttm', models.DateTimeField(auto_now_add=True)),
                ('used_del_dttm', models.DateTimeField(null=True)),
                ('used_nickname', models.DateTimeField(null=True)),
                ('pre_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='medicines.prescription')),
                ('user_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]