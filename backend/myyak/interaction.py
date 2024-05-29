import django, os, environ

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myyak.settings')
django.setup()

from medicines.models import *
from medicines.serializers import *
from cases.models import *
from cases.serializers import *
from django.contrib.auth import get_user_model

def interaction(case_sn, slot_num):
    stop = False
    user = get_user_model().objects.get(pk=1)
    case = Case.objects.get(case_sn=case_sn)
    slot = Slot.objects.get(case_id=case, slot_num=slot_num)
    slot_log = SlotLog.objects.get(slot_id=slot, slot_del_dttm__isnull=True)
    used_list = Used.objects.filter(user_id=user, used_del_dttm__isnull=True)
    for used in used_list:
        for ingredient in used.pre_id.pre_ingr.all():
            if ingredient.ingr_name in slot_log.med_id.med_interaction:
                stop = True

    if stop:
        print({'message': '위험표시'})
    else:
        print({'message': '안전표시'})


interaction('SF240206103502', 3)