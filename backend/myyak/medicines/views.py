from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
from responses import *
import datetime

# Create your views here.
@api_view(['GET'])
def search(request):
    try:
        bar_code = request.GET.get('bar_code')
        name = request.GET.get('name')
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
        
    response = []

    if bar_code:
        try:
            medicine = Medicine.objects.filter(med_barcode__contains=bar_code)
            serializer = MedicineSerializer(medicine, many=True)
            return Response(serializer.data)
        except:
            response.append({'message': 'Bar code not found'})

    if name:
        medicines = Medicine.objects.filter(med_name__contains=name)
        response = MedicineSerializer(medicines, many=True).data
    
    return Response(response)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def used(request):
    if request.method == 'GET':
        used = Used.objects.filter(user_id=request.user, used_del_dttm__isnull=True)
        serializer = UsedSerializer(used, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        try:
            pre_id = request.data['pre_id']
            used_nickname = request.data['used_nickname']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        prescription = Prescription.objects.get(pre_id=pre_id)
        serializer = UsedSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user_id=request.user, pre_id=prescription)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    elif request.method == 'PUT':
        try:
            used_id = request.data['used_id']
            used_nickname = request.data['used_nickname']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        used = Used.objects.get(used_id=used_id)
        serializer = UsedSerializer(used, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        try:
            used_id = request.data['used_id']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        used = Used.objects.get(used_id=used_id)
        serializer = UsedSerializer(used, data={'used_del_dttm': datetime.datetime.now()}, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def usedSearch(request):
    try:
        pre_name = request.data['pre_name']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
    prescriptions = Prescription.objects.filter(pre_name__contains=pre_name)
    serializer = PrescriptionSerializer(prescriptions, many=True)
    return Response(serializer.data)
