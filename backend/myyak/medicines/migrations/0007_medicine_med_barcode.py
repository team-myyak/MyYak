# Generated by Django 5.0.1 on 2024-02-05 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medicines', '0006_alter_ingredient_ingr_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicine',
            name='med_barcode',
            field=models.CharField(max_length=30, null=True),
        ),
    ]