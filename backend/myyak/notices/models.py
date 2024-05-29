from django.db import models
from django.conf import settings
from cases.models import *

# Create your models here.
class Notice(models.Model):
    notice_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    slot_log_id = models.ForeignKey(SlotLog, on_delete=models.SET_NULL, null=True)
    notice_create_dttm = models.DateTimeField(auto_now_add=True)
    notice_send_dttm = models.DateTimeField(null=True)
    notice_read_dttm = models.DateTimeField(null=True)
    notice_del_dttm = models.DateTimeField(null=True)
    notice_title = models.CharField(max_length=30)
    notice_content = models.CharField(max_length=300)