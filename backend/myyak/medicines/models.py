# Create your models here.
from django.db import models
from django.conf import settings

# Create your models here.
class Ingredient(models.Model):
    ingr_id = models.CharField(max_length=7, primary_key=True)
    ingr_name = models.TextField()


class Medicine(models.Model):
    med_id = models.IntegerField(primary_key=True)
    med_vendor = models.TextField(null=True)
    med_name = models.TextField(null=True)
    med_efficiency = models.TextField(null=True)
    med_method = models.TextField(null=True)
    med_warn = models.TextField(null=True)
    med_interaction = models.TextField(null=True)
    med_side_effect = models.TextField(null=True)
    med_store = models.TextField(null=True)
    med_barcode = models.TextField(null=True)
    med_ingr = models.ManyToManyField(Ingredient)


class Prescription(models.Model):
    pre_id = models.IntegerField(primary_key=True)
    # pre_id = models.BigAutoField(primary_key=True)
    pre_name = models.TextField(null=True)
    pre_ingr = models.ManyToManyField(Ingredient)


class Used(models.Model):
    used_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    pre_id = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True)
    used_reg_dttm = models.DateTimeField(auto_now_add=True)
    used_del_dttm = models.DateTimeField(null=True)
    used_nickname = models.CharField(max_length=20, null=True)