import django, os, environ

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myyak.settings')
django.setup()

from medicines.models import *
from medicines.serializers import *
import requests, xmltodict, time

def eyak():

    medicines = Medicine.objects.all()
    medicines.delete()
    max_page = 1
    page = 1
    cnt = 0
    inarow = 0

    while page <= max_page:

        url = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList'
        params ={'serviceKey' : 'cDUUm72WcKWjVqG2QmPMafkkDZiqyFWJj0WAz2%2BjNT8zd86c2tb1Py3NdcJB2NEJcMu17vLfZwUzFzCpApX8cg%3D%3D', 
                'pageNo' : str(page), 
                'numOfRows' : '100', 
                # 'type' : 'json'
        }

        try:
            inarow += 1
            response = requests.get(url, params=params).content
            response = xmltodict.parse(response)['response']
            # time.sleep(1)
        except:
            print(page, inarow)
            # time.sleep(1)
            continue

        if page == 1:
            max_page = int(response['body']['totalCount']) // 100 + 1

        for medicine in response['body']['items']['item']:
            if not Medicine.objects.filter(med_id=medicine.get('itemSeq')):
                save_data = {
                    'med_id': medicine.get('itemSeq'),
                    'med_vendor': medicine.get('entpName'),
                    'med_name': medicine.get('itemName'),
                    'med_efficiency': medicine.get('efcyQesitm'),
                    'med_method': medicine.get('useMethodQesitm'),
                    'med_warn': medicine.get('atpnQesitm'),
                    'med_interaction': medicine.get('intrcQesitm'),
                    'med_side_effect': medicine.get('seQesitm'),
                    'med_store': medicine.get('depositMethodQesitm'),
                }
                serializer = MedicineSerializer(data = save_data)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    cnt += 1
                    print(cnt)
        page += 1
        inarow = 0

eyak()
