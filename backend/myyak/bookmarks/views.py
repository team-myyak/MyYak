from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from cases.models import Case, Bookmark, UserCase
from rest_framework.response import Response
from responses import *
import datetime

# Create your views here.
@api_view(['PUT', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def bookmarks(request):
    try:
        user_id = request.user.id
        case_sn = request.data['case_sn']
        book_num_order = request.data['book_num_order']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
    
    try:
        case_id = Case.objects.get(case_sn=case_sn).case_id
        UserCase.objects.get(user_id_id=user_id, case_id_id=case_id, reg_unreg_dttm__isnull=True)
    except:
        return Response({'message': 'Fail: Invalid case_sn'}, status=400)
    
    if request.method == 'PUT':
        try:
            slot_num = request.data['slot_num']
            book_nickname = request.data['book_nickname']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        slot_id = (int(case_id)-1)*8 + int(slot_num)

        # Check if the bookmark already exists
        try:
            Bookmark.objects.get(slot_id=slot_id, user_id=user_id, book_num_order=book_num_order, book_del_dttm__isnull=True)
            return Response({'message': 'Fail: The bookmark already exists'}, status=400)
        except Bookmark.DoesNotExist:
            pass
        except:
            return Response({'message': 'Fail: Unknown error'}, status=400)

        new_bookmark = Bookmark(
            user_id_id=request.user.id,
            slot_id_id=slot_id,
            book_num_order=book_num_order,
            book_nickname=book_nickname,
            book_del_dttm=None
        )
        new_bookmark.save()
        
        return Response({'message': 'Success'}, status=200)

    elif request.method == 'POST':
        try:
            slot_num = request.data['slot_num']
            new_nickname = request.data['new_nickname']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        slot_id = (case_id-1)*8 + slot_num
           
        # Validate the bookmark
        try:
            bookmark = Bookmark.objects.get(user_id_id=user_id, slot_id_id=slot_id, book_num_order=book_num_order, book_del_dttm__isnull=True)
        except Bookmark.DoesNotExist:
            return Response({'message': 'Cannot find the bookmark'}, status=400)
        except:
            return Response({'message': 'Unknown error'}, status=400)
        
        bookmark.book_nickname = new_nickname
        bookmark.save()
            
        return Response({'message': 'Success'}, status=200)
    
    elif request.method == 'DELETE':
        # Validate the bookmark
        try:
            bookmark = Bookmark.objects.get(user_id_id=user_id, book_num_order=book_num_order, book_del_dttm__isnull=True)
        except Bookmark.DoesNotExist:
            return Response({'message': 'Cannot find the bookmark'}, status=400)
        except:
            return Response({'message': 'Unknown error'}, status=400)
            
        bookmark.book_del_dttm = datetime.datetime.now()
        bookmark.save()
        
        if bookmark.book_del_dttm:
            return Response({'message': 'Success'}, status=200)
        else:
            return Response({'message': 'Fail'}, status=400)
