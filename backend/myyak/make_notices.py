import django, os, environ

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myyak.settings')
django.setup()

from cases.models import *
from notices.models import *
from cases.serializers import *
from notices.serializers import *
import time, datetime

def notice():
    logs = SlotLog.objects.filter(slot_del_dttm__isnull=True)
    for log in logs:
        slot_num = log.slot_id_id % 8 if log.slot_id_id % 8 else 8
        rest_days = max(0, (log.slot_exp - datetime.date.today()).days)
        if rest_days <= 7:
            notice_data = {
                'notice_create_dttm': datetime.datetime.now(),
                'notice_content': f'{slot_num}번 칸의 유통기한이 {rest_days}일 남았습니다.'
            }
            serializer = NoticeSerializer(data=notice_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save(user_id=log.user_id, slot_log_id=log)


notice()