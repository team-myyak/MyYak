from django.db import models
from django.conf import settings
from medicines.models import Medicine

# Create your models here.
class Case(models.Model):
    case_id = models.BigAutoField(primary_key=True)
    case_sn = models.CharField(max_length=50, unique=True)
    case_reg_dttm = models.DateTimeField(auto_now_add=True)
    case_temp = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    case_humid = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    case_sensor_dttm = models.DateTimeField(auto_now=True)

class Slot(models.Model):
    slot_id = models.BigAutoField(primary_key=True)
    case_id = models.ForeignKey(Case, on_delete=models.CASCADE)
    slot_num = models.SmallIntegerField()

class SlotLog(models.Model):
    slot_log_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    slot_id = models.ForeignKey(Slot, on_delete=models.SET_NULL, null=True)
    med_id = models.ForeignKey(Medicine, on_delete=models.SET_NULL, null=True)
    slot_reg_dttm = models.DateTimeField(auto_now_add=True, null=True)
    slot_del_dttm = models.DateTimeField(null=True)
    slot_exp = models.DateField(null=True)

class UserCase(models.Model):
    reg_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    case_id = models.ForeignKey(Case, on_delete=models.SET_NULL, null=True)
    reg_dttm = models.DateTimeField(auto_now_add=True)
    reg_unreg_dttm = models.DateTimeField(null=True)
    reg_nickname = models.CharField(max_length=50, null=True)

class Bookmark(models.Model):
    book_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    slot_id = models.ForeignKey(Slot, on_delete=models.SET_NULL, null=True)
    book_num_order = models.SmallIntegerField()
    book_nickname = models.CharField(max_length=50, null=True)
    book_reg_dttm = models.DateTimeField(auto_now_add=True)
    book_del_dttm = models.DateTimeField(null=True)