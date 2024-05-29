import django, os, environ

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myyak.settings')
django.setup()

from medicines.models import *
from medicines.serializers import *
import requests, xmltodict, time

def ingr():

    prescriptions = Prescription.objects.all()
    prescriptions.delete()
    max_page = 1
    page = 1
    inarow = 0
    cnt = 0

    while page <= max_page:
        url = 'http://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService04/getDrugPrdtPrmsnDtlInq03'
        params = {
            'serviceKey': 'cDUUm72WcKWjVqG2QmPMafkkDZiqyFWJj0WAz2%2BjNT8zd86c2tb1Py3NdcJB2NEJcMu17vLfZwUzFzCpApX8cg%3D%3D',
            'pageNo': page,
            'numOfRows': 100,
            # 'type': 'json'
        }
        try:
            inarow += 1
            response = requests.get(url, params=params).content
            response = xmltodict.parse(response)['response']
        except:
            print(page, inarow)
            continue

        if page == 1:
            max_page = int(response['body']['totalCount']) // 100 + 1


        for medicine in response['body']['items']['item']:

            try:
                in_Medicine = Medicine.objects.get(med_id=medicine.get('ITEM_SEQ'))
            except:
                in_Medicine = False

            if medicine.get('CANCEL_NAME') == '정상' and not Prescription.objects.filter(pre_id=medicine.get('ITEM_SEQ')):
                save_data = {
                    'pre_id': medicine.get('ITEM_SEQ'),
                    'pre_name': medicine.get('ITEM_NAME'),
                }
                serializer = PrescriptionSerializer(data = save_data)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    cnt += 1
                    print(cnt)

                pre = Prescription.objects.get(pre_id=medicine.get('ITEM_SEQ'))

                if in_Medicine:
                    in_Medicine.med_barcode = medicine.get('BAR_CODE')
                    in_Medicine.save()

                ingredients = medicine.get('MAIN_ITEM_INGR')
                if ingredients:
                    ingredients = ingredients.split('|')
                    for ingredient in ingredients:
                        try:
                            ingr = Ingredient.objects.get(ingr_id=ingredient[1:8])
                        except:
                            save_data = {
                                'ingr_id': ingredient[1:8],
                                'ingr_name': ingredient[9:]
                            }
                            serializer = IngredientSerializer(data = save_data)
                            if serializer.is_valid(raise_exception=True):
                                serializer.save()
                            ingr = Ingredient.objects.get(ingr_id=ingredient[1:8])
                            
                        pre.pre_ingr.add(ingr)
                        if in_Medicine:
                            in_Medicine.med_ingr.add(ingr)

        page += 1
        inarow = 0

ingr()