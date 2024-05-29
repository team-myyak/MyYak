# Generated by Django 5.0.1 on 2024-01-25 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Medicine',
            fields=[
                ('med_id', models.IntegerField(primary_key=True, serialize=False)),
                ('med_vendor', models.TextField(null=True)),
                ('med_name', models.TextField(null=True)),
                ('med_efficiency', models.TextField(null=True)),
                ('med_method', models.TextField(null=True)),
                ('med_warn', models.TextField(null=True)),
                ('med_interaction', models.TextField(null=True)),
                ('med_side_effect', models.TextField(null=True)),
                ('med_store', models.TextField(null=True)),
            ],
        ),
    ]
