# Generated by Django 5.0.1 on 2024-02-15 10:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notices', '0002_remove_notice_slot_lod_id_notice_slot_log_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='notice',
            name='notice_title',
            field=models.CharField(default='사용기한 안내', max_length=30),
            preserve_default=False,
        ),
    ]
