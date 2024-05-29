from django.shortcuts import render
from django.http.response import JsonResponse

from .models import *
from medicines.models import *
from .serializers import *
from responses import *

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

import datetime

# Create your views here.
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def notice(request):
    if request.method == 'GET':
        notices = Notice.objects.filter(user_id=request.user, notice_del_dttm__isnull=True)
        serializer = NoticeSerializer(notices, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        try:
            notice_id = request.data['notice_id']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        notice = Notice.objects.get(notice_id=notice_id)
        data = {
            'notice_read_dttm': datetime.datetime.now()
        }
        serializer = NoticeSerializer(notice, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
    elif request.method == 'DELETE':
        try:
            notice_id = request.data['notice_id']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        notice = Notice.objects.get(notice_id=notice_id)
        data = {
            'notice_del_dttm': datetime.datetime.now()
        }
        serializer = NoticeSerializer(notice, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
