from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from responses import *
from django.utils import timezone
from .models import User
from cases.models import Case, UserCase, SlotLog, Bookmark
from medicines.models import Used
from notices.models import Notice
import datetime

# Create your views here.

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteUser(request):
    try:
        account = User.objects.get(id=request.user.id)
    except:
        return Response({'message': '탈퇴가 불가능합니다. 다시 시도해주세요.'}, status=400)
    
    # 탈퇴되지 않은 유저만 탈퇴 가능
    if account.user_quit_dttm != None:
        return Response({'message': '탈퇴가 불가능합니다. 다시 시도해주세요.'}, status=400)
    
    # Delete all user's cases
    cases = UserCase.objects.filter(user_id=account.id, reg_unreg_dttm__isnull=True)
    for case in cases:
        case.reg_unreg_dttm = datetime.datetime.now()
        case.save()

    # Delete all used medicines
    used_meds = Used.objects.filter(user_id=account.id, used_del_dttm__isnull=True)
    for used_med in used_meds:
        used_med.used_del_dttm = datetime.datetime.now()
        used_med.save()
    
    # Delete all notices
    notices = Notice.objects.filter(user_id=account.id, notice_del_dttm__isnull=True)
    for notice in notices:
        notice.notice_del_dttm = datetime.datetime.now()
        notice.save()
    
    # Delete all bookmarks
    bookmarks = Bookmark.objects.filter(user_id=account.id, book_del_dttm__isnull=True)
    for bookmark in bookmarks:
        bookmark.book_del_dttm = datetime.datetime.now()
        bookmark.save()
    
    account.user_quit_dttm = timezone.now()
    account.is_active = 0
    account.save()
    
    if (account.user_quit_dttm != None):
        return Response({'message': '탈퇴가 완료되었습니다.'}, status=200)
    else:
        return Response({'message': '다시 시도해주세요.'}, status=400)
    

@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def userInfo(request):
    if request.method == 'POST':
        account = User.objects.get(id=request.user.id)
        
        return Response({
            'username': account.username,
            'email': account.email,
            'date_joined': account.date_joined,
            'user_realname': account.user_realname,
            })
       
    elif request.method == 'PUT':
        try:
            new_email = request.data['new_email']
            new_realname = request.data['new_realname']
        except KeyError:
            return WRONG_REQUEST
        except:
            return UNKNOWN_ERROR
        try:
            account = User.objects.get(id=request.user.id, user_quit_dttm=None)
        except:
            return Response({'message': '현재 수정이 불가능합니다. 다시 시도해주세요.'}, status=400)
        account.email = new_email
        account.user_realname = new_realname
        account.save()

        return Response({'message': 'Success'}, status=200)

# username 중복 확인
@api_view(['POST'])
def isUniqueUsername(request):
    # TODO: 각 정보에 대한 validation 추가(TokenAuthentication)
    try:
        name = request.data['username']
    except KeyError:
        return WRONG_REQUEST
    except:
        return UNKNOWN_ERROR
    try:
        User.objects.get(username=name)
        return Response({'duplicated': True, 'message': '이미 존재하는 아이디입니다.'}, status=400)
    except User.DoesNotExist:
        return Response({'duplicated': False, 'message': '사용 가능한 아이디입니다.'}, status=200)
