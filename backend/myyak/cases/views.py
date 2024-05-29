from django.shortcuts import render
from django.http.response import JsonResponse

from .models import *
from medicines.models import *
from .serializers import *

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from myyak.globals import SOCKET_SERVER_QUEUE, DEVICE_FEEDBACK_MAP, condition
from responses import *
from socket_server import client_connections

import datetime
import json
import uuid

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAdminUser])
def newCase(request):
    now = str(datetime.datetime.now())
    sn = 'SF' + now[2:4] + now[5:7] + now[8:10] + now[11:13] + now[14:16] + now[17:19]
    case_data = {
        'case_sn': sn,
    }
    case_serializer = CaseSerializer(data=case_data)
    if case_serializer.is_valid(raise_exception=True):
        case_serializer.save()

    case = Case.objects.get(case_sn=sn)
    for slot_num in range(1, 9):
        slot_data = {
            'slot_num': slot_num
        }
        slot_serializer = SlotSerializer(data=slot_data)
        if slot_serializer.is_valid(raise_exception=True):
            slot_serializer.save(case_id=case)

    return Response({'message': 'Case has been made'}, status=status.HTTP_201_CREATED)


@api_view(['POST', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def register(request):
    try:
        case_sn = request.data['case_sn']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
    try:
        case = Case.objects.get(case_sn=case_sn)
    except:
        return Response({'message': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        try:
            request.data['reg_nickname']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        
        registered_users = UserCase.objects.filter(case_id=case, reg_unreg_dttm__isnull=True)
        if len(registered_users) >= 4:
            return Response({'error': '이미 4명의 사용자가 등록되어 있습니다.'}, status=status.HTTP_403_FORBIDDEN)

        user_case = UserCase.objects.filter(user_id=request.user, case_id=case)
        if user_case and not user_case[len(user_case) - 1].reg_unreg_dttm:
            return Response({'error': '이미 등록한 기기입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = UserCaseSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save(user_id=request.user, case_id=case)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    elif request.method == 'DELETE':
        user_case = UserCase.objects.filter(user_id=request.user, case_id=case)
        user_case = user_case[len(user_case) - 1]
        if not user_case.reg_unreg_dttm:
            unreg_data = {
                'reg_unreg_dttm': datetime.datetime.now()
            }
            serializer = UserCaseSerializer(user_case, data=unreg_data, partial=True)
            if serializer.is_valid(raise_exception=True):
                # Delete bookmarks
                slot_ids = [slot.slot_id for slot in Slot.objects.filter(case_id=case)]
                for id in slot_ids:
                    print(id)
                    try:
                        bookmark = Bookmark.objects.get(slot_id=id, user_id=request.user, book_del_dttm__isnull=True)
                        bookmark.book_del_dttm = datetime.datetime.now()
                        bookmark.save()
                    except:
                        pass
                
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "이미 연결이 해제되었습니다."}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        try:
            reg_nickname = request.data['reg_nickname']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        
        user_case = UserCase.objects.filter(user_id=request.user, case_id=case)
        user_case = user_case[len(user_case) - 1]
        serializer = UserCaseSerializer(user_case, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def reset(request):
    try:
        case_sn = request.data['case_sn']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR

    try:
        case = Case.objects.get(case_sn=case_sn)
        UserCase.objects.get(user_id=request.user, case_id=case, reg_unreg_dttm__isnull=True)
    except:
        return Response({'message': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
    user_cases = UserCase.objects.filter(case_id=case)
    unreg_data = {
        'reg_unreg_dttm': datetime.datetime.now()
    }
    for user_case in user_cases:
        if not user_case.reg_unreg_dttm:
            serializer = UserCaseSerializer(user_case, data=unreg_data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
    else:
        return Response({'message': '초기화가 완료되었습니다.'}, status=status.HTTP_200_OK)

@api_view(['POST', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def slot(request):
    try:
        case_sn = request.data['case_sn']
        slot_num = request.data['slot_num']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
    
    try:
        case = Case.objects.get(case_sn=case_sn)
        slot = Slot.objects.get(case_id=case, slot_num=slot_num)
        slot_id = int(case.case_id) * 8 + int(slot_num) - 8
        UserCase.objects.get(user_id=request.user, case_id=case, reg_unreg_dttm__isnull=True)
    except:
        return Response({'message': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)

    # 보유 약품 추가
    if request.method == 'POST':
        try:
            med_id = request.data['med_id']
            slot_exp = request.data['slot_exp']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        
        medicine = Medicine.objects.get(med_id=med_id)
        slot_log_data = {
            'slot_reg_dttm': datetime.datetime.now(),
            'slot_exp': slot_exp
        }
        serializer = SlotLogSerializer(data=slot_log_data)

        # Check if the slot is already occupied
        try:
            slot_log = SlotLog.objects.filter(slot_id=slot, slot_del_dttm__isnull=True)
            if len(slot_log) > 0:
                return Response({'error': '이미 약품이 등록되어 있습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            pass
        
        if serializer.is_valid(raise_exception=True):
            # Send a request to the socket server
            request_id = str(uuid.uuid4())
            socket_request = {
                'serialNumber': case.case_sn,
                'slotNumber': slot_num,
                'requestName': 'addMed',
                'userId': request.user.id,
                'slotId': slot_id,
                'requestId': request_id,
            }
            try:
                client_connections[case.case_sn]
            except KeyError:
                return CASE_NOT_ONLINE
                
            socket_request_json = json.dumps(socket_request)
            SOCKET_SERVER_QUEUE.put(socket_request_json)
            with condition:
                DEVICE_FEEDBACK_MAP[request_id] = {"message": None}
                condition.wait_for(lambda: DEVICE_FEEDBACK_MAP[request_id]["message"] is not None)
            response = DEVICE_FEEDBACK_MAP[request_id]["message"]
            del DEVICE_FEEDBACK_MAP[request_id]
            if response == 'Success':
                serializer.save(user_id=request.user, slot_id=slot, med_id=medicine)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'message': '약품 등록에 실패했습니다.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    elif request.method == 'DELETE':
        slot_log = SlotLog.objects.filter(slot_id=slot)
        slot_log = slot_log[len(slot_log) - 1]
        del_data = {
            'slot_del_dttm': datetime.datetime.now()
        }
        serializer = SlotLogSerializer(slot_log, data=del_data, partial=True)

        # Delete bookmarks
        bookmarks = Bookmark.objects.filter(slot_id=slot.slot_id, user_id=request.user, book_del_dttm__isnull=True)
        for bookmark in bookmarks:
            bookmark.book_del_dttm = datetime.datetime.now()
            bookmark.save()
        
        if serializer.is_valid(raise_exception=True):
            # Send a request to the socket server
            request_id = str(uuid.uuid4())
            socket_request = {
                'serialNumber': case.case_sn,
                'slotNumber': slot_num,
                'requestName': 'delMed',
                'userId': request.user.id,
                'slotId': slot_id,
                'requestId': request_id
            }

            try:
                client_connections[case.case_sn]
            except KeyError:
                return CASE_NOT_ONLINE
                
            socket_request_json = json.dumps(socket_request)

            # TODO: Add new key-value pair to the map with unique request id
            SOCKET_SERVER_QUEUE.put(socket_request_json)
            with condition:
                DEVICE_FEEDBACK_MAP[request_id] = {"message": None}

            with condition:
                condition.wait_for(lambda: DEVICE_FEEDBACK_MAP[request_id]["message"] is not None)
            
            response = DEVICE_FEEDBACK_MAP[request_id]["message"]
            del DEVICE_FEEDBACK_MAP[request_id]
            
            if response == 'Success':
                serializer.save()
                return Response({'message': '삭제되었습니다.'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': '삭제에 실패했습니다.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == "PUT":
        slot_log = SlotLog.objects.filter(slot_id=slot, slot_del_dttm__isnull=True)
        slot_log = slot_log[len(slot_log) - 1]
        serializer = SlotLogSerializer(slot_log, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            # Send a request to the socket server
            request_id = str(uuid.uuid4())
            socket_request = {
                'serialNumber': case.case_sn,
                'slotNumber': slot_num,
                'requestName': 'addMed',
                'userId': request.user.id,
                'slotId': slot_id,
                'requestId': request_id,
            }
            try:
                client_connections[case.case_sn]
            except KeyError:
                return CASE_NOT_ONLINE
                
            socket_request_json = json.dumps(socket_request)
            SOCKET_SERVER_QUEUE.put(socket_request_json)
            with condition:
                DEVICE_FEEDBACK_MAP[request_id] = {"message": None}
                condition.wait_for(lambda: DEVICE_FEEDBACK_MAP[request_id]["message"] is not None)
            response = DEVICE_FEEDBACK_MAP[request_id]["message"]
            del DEVICE_FEEDBACK_MAP[request_id]
            if response == 'Success':
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'message': '수정에 실패했습니다.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mycase(request):
    mycases = UserCase.objects.filter(user_id=request.user, reg_unreg_dttm__isnull=True)
    serializer = UserCaseSerializer(mycases, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def slotList(request):
    try:
        case_sn = request.GET['case_sn']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR

    try:
        case = Case.objects.get(case_sn=case_sn)
        user_id = request.user.id
        UserCase.objects.get(user_id=user_id, case_id=case.case_id, reg_unreg_dttm__isnull=True)
    except:
        return Response({'message': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)

    slots = Slot.objects.filter(case_id=case)
    slot_ids = []
    for slot in slots:
        slot_ids.append(slot.slot_id)
    
    response = []
    
    for slot_id in slot_ids:
        try:
            slot_log = SlotLog.objects.get(slot_id=slot_id, slot_del_dttm__isnull=True)
            serializer = SlotLogSerializer(slot_log).data
            response.append(serializer)
        except:
            response.append(None)

    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def slotInfo(request):
    try:
        slot_num = request.GET['slot_num']
        case_sn = request.GET['case_sn']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR

    try:
        case_id = Case.objects.get(case_sn=case_sn).case_id
        UserCase.objects.get(user_id_id=request.user.id, case_id_id=case_id, reg_unreg_dttm__isnull=True)
    except:
        return Response({'message': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
    slot = Slot.objects.get(case_id_id=case_id, slot_num=slot_num)
    slot_id = slot.slot_id

    try:
        slot_log = SlotLog.objects.filter(slot_id_id=slot_id, slot_del_dttm__isnull=True)
        if len(slot_log) > 0:
            slot_log = slot_log[len(slot_log) - 1]
        else:
            return Response({'message': 'No medicine in the slot'})

        serializer = SlotLogSerializer(slot_log).data

        serializer['warning'] = ''
        used_list = Used.objects.filter(user_id=request.user, used_del_dttm__isnull=True)
        for used in used_list:
            for ingredient in used.pre_id.pre_ingr.all():
                if slot_log.med_id.med_interaction and ingredient.ingr_name in slot_log.med_id.med_interaction:
                    serializer['warning'] += f'{used.used_nickname} 와/과 함께 복용 시 주의를 요합니다.\n'

        return Response(serializer)
    except:
        return Response({'message': 'API ERROR'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bookList(request):
    try:
        case_sn = request.GET['case_sn']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
    response = [None, None, None, None]
    try:
        # Validate serial and user
        case_id = Case.objects.get(case_sn=case_sn).case_id
        user_id = request.user.id
        UserCase.objects.get(user_id=user_id, case_id=case_id, reg_unreg_dttm__isnull=True)
        valid_slot_ids = [id for id in range( (case_id-1)*8+1, case_id*8+1)]
    except:
        return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
    
    for id in valid_slot_ids:
        try:
            slot_log = SlotLog.objects.get(slot_id=id, slot_del_dttm__isnull=True)
            med_name = Medicine.objects.get(med_id=slot_log.med_id_id).med_name
            book = Bookmark.objects.get(slot_id=id, user_id=user_id, book_del_dttm__isnull=True)
            book.med_name = med_name
            book = BookmarkSerializer(book).data
            response[book['book_num_order']-1] = book
        except:
            continue

    return Response(response)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def slotSearch(request):
    try:
        case_sn = request.data['case_sn']
        symptom = request.data['symptom']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
    
    response = []
    try:
        # Validate serial and user
        case = Case.objects.get(case_sn=case_sn)
        user_id = request.user.id
        UserCase.objects.get(user_id_id=user_id, case_id_id=case.case_id, reg_unreg_dttm__isnull=True)
    except:
        return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
    slots = Slot.objects.filter(case_id=case)
    for slot in slots:
        slot_log = SlotLog.objects.filter(slot_id=slot, slot_del_dttm__isnull=True)
        if slot_log:
            slot_log = slot_log[len(slot_log) - 1]
            medicine = Medicine.objects.get(med_id=slot_log.med_id.med_id)
            if symptom in medicine.med_efficiency:
                serializer = SlotLogSerializer(slot_log)
                response.append(serializer.data)
    return Response(response)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def med(request):
    if request.method == 'POST':
        try:
            case_sn = request.data['case_sn']
            slot_num = request.data['slot_num']
            user_id = request.user.id
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        
        # Check if the user is registered to the case
        try:
            case = Case.objects.get(case_sn=case_sn)
            slot_id = int(case.case_id) * 8 + int(slot_num) - 8
            UserCase.objects.get(user_id=user_id, case_id=case.case_id, reg_unreg_dttm__isnull=True)
        except Case.DoesNotExist:
            return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'error': 'API ERROR'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Send a request to the socket server
        request_id = str(uuid.uuid4())
        socket_request = {
            'serialNumber': case_sn,
            'slotNumber': int(slot_num),
            'requestName': 'openSlot',
            'userId': user_id,
            'slotId': slot_id,
            'requestId': request_id
        }

        try:
            client_connections[case_sn]
        except KeyError:
            return CASE_NOT_ONLINE

        socket_request_json = json.dumps(socket_request)
        SOCKET_SERVER_QUEUE.put(socket_request_json)

        with condition:
            DEVICE_FEEDBACK_MAP[request_id] = {"message": None}
            condition.wait_for(lambda: DEVICE_FEEDBACK_MAP[request_id]["message"] is not None)
        response = DEVICE_FEEDBACK_MAP[request_id]["message"]
        del DEVICE_FEEDBACK_MAP[request_id]
        if response == 'Success':
            return Response({'message': 'Request sent to the server. Please wait for the slot to open.'})
        else:
            return Response({'message': 'Request failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

