import os
import json
import socket
import ssl
import threading
import environ
import errno

from accounts.models import User
from cases.models import Case, UserCase, Bookmark, SlotLog, Medicine
from notices.models import Notice
from myyak.globals import SOCKET_SERVER_QUEUE, DEVICE_FEEDBACK_MAP, condition

env = environ.Env(
    DEBUG=(bool, False)
)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
SERVER_IP_ADDRESS = env('SERVER_IP_ADDRESS')
TCP_PORT = int(env('TCP_PORT'))
# SSL_FULLCHAIN_PATH = env('SSL_FULLCHAIN_PATH')
# SSL_PRIVKEY_PATH = env('SSL_PRIVKEY_PATH')

def addSizePrefix(message):
    size = len(message.encode('utf-8'))
    return f"{size:04d}{message}"

INVALID_REQUEST_ERROR = addSizePrefix(json.dumps({"message": "Invalid request: request must be a valid JSON string."}))
INVALID_SN_ERROR = addSizePrefix(json.dumps({"message": "Invalid S/N! Closing connection..."}))
QUERY_ERROR = addSizePrefix(json.dumps({"message": "Fail: Error occurred while searching database."}))
CASE_NOT_EXIST_ERROR = addSizePrefix(json.dumps({"message": "Fail: Case does not exist."}))
WRONG_REQUEST_ERROR = addSizePrefix(json.dumps({"message": "Fail: Wrong request."}))

# key: S/N, value: connection
client_connections = {}


def makeResponse(request, serial_number):
    """
    API 요청에 대한 응답을 생성하는 함수.
    request: API 요청
    response_data: 응답 데이터
    status_code: 응답 상태 코드
    """
    # Validate request format
    try:
        request = json.loads(request)
    except json.JSONDecodeError:
        return INVALID_REQUEST_ERROR
    
    # Make response
    if request.get('requestName') == 'getUserList':
        try:
            case_id = Case.objects.get(case_sn=serial_number).case_id
        except:
            return CASE_NOT_EXIST_ERROR
        
        try:
            # Get user list by case_id whose reg_unreg_dttm is null (currently registered)
            user_ids = UserCase.objects.filter(case_id_id=case_id, reg_unreg_dttm__isnull=True).values_list('user_id', flat=True)
        except:
            return QUERY_ERROR

        user_list = []
        for user_id in user_ids:
            try:
                # Get user info who is currently registered
                user = User.objects.get(id=user_id, user_quit_dttm__isnull=True)
                user_json = {}
                user_json['userId'] = user.id
                user_json['userName'] = user.user_realname
                user_list.append(user_json)
            except:
                continue

        response = {}
        response["message"] = "Success"
        response["requestNumber"] = request.get('requestNumber')
        response["count"] = len(user_list)
        response["result"] = user_list
        response = addSizePrefix(json.dumps(response))
        return response
        
    elif request.get('requestName') == 'getUserBookList':
        user_id = request.get('userId')

        try:
            case_id = Case.objects.get(case_sn=serial_number).case_id
        except:
            return CASE_NOT_EXIST_ERROR
            
        try:
            bookmarks = list(Bookmark.objects.filter(user_id_id=user_id, slot_id_id__gt=(case_id-1)*8, slot_id_id__lte=case_id*8, book_del_dttm__isnull=True).values_list('book_nickname', 'book_num_order', 'slot_id_id'))
        except:
            return QUERY_ERROR

        user_book_list = []
        for bookmark in bookmarks:
            book_nickname = bookmark[0]
            bookmarkOrder = bookmark[1]
            slotNumber = bookmark[2]
            book_json = {}
            book_json['medName'] = book_nickname
            book_json['slotNumber'] = slotNumber
            book_json['bookmarkOrder'] = bookmarkOrder
            user_book_list.append(book_json)

        response = {}
        response["message"] = "Success"
        response["requestNumber"] = request.get('requestNumber')
        response["count"] = len(user_book_list)
        response["result"] = user_book_list
        response = addSizePrefix(json.dumps(response))
        return response
            
    elif request.get('requestName') == 'getMedBySym':
        symptom = request.get('symptom')
        try:
            case_id = Case.objects.get(case_sn=serial_number).case_id
        except:
            return CASE_NOT_EXIST_ERROR

        try:
            # Get slot_id and med_id by case_id and med_id whose reg_unreg_dttm is null (currently registered)
            slot_med = list(SlotLog.objects.filter(slot_del_dttm__isnull=True, slot_id_id__gt=(case_id-1)*7, slot_id_id__lte=case_id*8).values_list('slot_id_id', 'med_id_id'))
            slot_list = []
            for slot in slot_med:
                slot_id = slot[0]
                med_id = slot[1]
                med_efcy = Medicine.objects.get(med_id=med_id).med_efficiency
                if symptom in med_efcy:
                    slot_list.append(slot_id)
        except:
            return QUERY_ERROR       

        response = {}
        response["message"] = "Success"
        response["requestNumber"] = request.get('requestNumber')
        response["count"] = len(slot_list)
        response["result"] = slot_list
        response = addSizePrefix(json.dumps(response))
        return response

    elif request.get('requestName') == 'getSlotInfoList':
        try:
            case_id = Case.objects.get(case_sn=serial_number).case_id
        except:
            return CASE_NOT_EXIST_ERROR
        
        slot_info_list = []
        for slot_num in range(1, 9):
            slot_id = (case_id-1)*8 + slot_num

            slot_json = {}
            slot_json['slotNumber'] = slot_num

            try:
                # Get slot info by slot_id whose reg_unreg_dttm is null (currently registered)
                slot = SlotLog.objects.get(slot_id_id=slot_id, slot_del_dttm__isnull=True)
                # Get med info by med_id
                medicine = Medicine.objects.get(med_id=slot.med_id_id)
                slot_json['medName'] = medicine.med_name
                slot_json['slotId'] = slot_id
                slot_json['medExist'] = True
                slot_info_list.append(slot_json)
            except:
                slot_json['medExist'] = False
                slot_info_list.append(slot_json)

        response = {}
        response["message"] = "Success"
        response["requestNumber"] = request.get('requestNumber')
        response["count"] = len(slot_info_list)
        response["result"] = slot_info_list
        response = addSizePrefix(json.dumps(response))
        return response

    # TODO: Warning message for user specific side effects
    elif request.get('requestName') == 'getMedInfo':
        slot_id = request.get('slotId')

        try:
            # Get slot info by slot_id whose reg_unreg_dttm is null (currently registered)
            slot_log = SlotLog.objects.get(slot_id_id=slot_id, slot_del_dttm__isnull=True)
            # Get med info by med_id
            medicine = Medicine.objects.get(med_id=slot_log.med_id_id)
        except:
            return QUERY_ERROR

        response = {}
        response["message"] = "Success"
        response["requestNumber"] = request.get('requestNumber')
        response["warningExist"] = False # TODO: Warning message for user specific side effects
        response["slotNumber"] = slot_id
        response["medName"] = medicine.med_name
        response["slotExp"] = str(slot_log.slot_exp)
        response["medMethod"] = medicine.med_method
        response["medWarning"] = medicine.med_warn
        response = addSizePrefix(json.dumps(response))
        return response

    # Wrong request name
    else:
        return WRONG_REQUEST_ERROR


# Queue handler
def queueHandler():
    print("Message queue handler started")
    while True:
        message = SOCKET_SERVER_QUEUE.get()
        print(f"Message from queue: {message}", type(message))
        message_json = json.loads(message)
        
        target_sn = message_json.get('serialNumber')

        try:
            target_socket = client_connections[target_sn]
            message = addSizePrefix(json.dumps(message_json))
            target_socket.sendall(message.encode('utf-8'))
            print(f"Message sent to {target_sn}")
        except:
            print(f"Invalid S/N: {target_sn}")

        
def clientHandler(client_socket, client_address, serial_number):
    """
    클라이언트와의 통신을 처리하는 함수.
    """
    print(f"Connected to {client_address} with serial number: {serial_number}")

    while True:
        try:
            message = client_socket.recv(1024).decode('utf-8')
        except ConnectionResetError:
            # Unexpected disconnection
            print(f"Connection lost with {client_address} with serial number: {serial_number}")
            client_socket.close()
            break
        except:
            # Unexpected error
            print(f"Unexpected error occurred with {client_address} with serial number: {serial_number}")
            client_socket.close()
            break

        if message:
            try:
                message_json = json.loads(message)
            except:
                client_socket.sendall(INVALID_REQUEST_ERROR.encode('utf-8'))
                continue

            if message_json.get('requestName') == 'feedback':
                user_id = message_json.get('userId', None)
                slot_id = message_json.get('slotId', None)
                case_sn = message_json.get('serialNumber', None)
                is_done = message_json.get('isDone', None)
                request_id = message_json.get('requestId', None)

                if not (user_id and slot_id and case_sn and request_id and is_done):
                    client_socket.sendall(INVALID_REQUEST_ERROR.encode('utf-8'))
                    continue

                print(message)
                
                if is_done == 'True':
                    is_done = 'Success'
                else:
                    is_done = 'Fail'

                DEVICE_FEEDBACK_MAP[request_id] = {"message": None}
                with condition:
                    DEVICE_FEEDBACK_MAP[request_id]["message"] = is_done
                    condition.notify_all()

            # API request or wrong request name(handled in makeResponse)
            else:
                response = makeResponse(message, serial_number)
                client_socket.sendall(response.encode('utf-8'))

        # Connection closed
        else:
            print(f"Connection closed by {client_address} with serial number: {serial_number}")
            client_socket.close()
            del client_connections[serial_number]


def acceptConnections(server_socket):
    """
    클라이언트의 연결을 수락하고 처리하는 함수.
    """
    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    # context.load_cert_chain(certfile=SSL_FULLCHAIN_PATH, keyfile=SSL_PRIVKEY_PATH)

    while True:
        client_socket, client_address = server_socket.accept()
        #client_socket = context.wrap_socket(client_socket, server_side=True)
        client_ip = client_address[0]

        serial_number = client_socket.recv(1024).decode('utf-8')
        print(f"Serial number from {client_ip}: {serial_number}")

        valid_serial_numbers = list(Case.objects.values_list('case_sn', flat=True))
        valid_sn = False

        for sn in valid_serial_numbers:
            if serial_number == sn:
                valid_sn = True
                break

        if not valid_sn:
            response = 'Invalid S/N! Closing connection...'
            client_socket.sendall(response.encode('utf-8'))
            client_socket.close()
            continue

        client_connections[serial_number] = client_socket
        client_thread = threading.Thread(target=clientHandler, args=(client_socket, client_address, serial_number))
        client_thread.start()


def startServer(host, port):
    """
    소켓 서버를 시작하는 함수.
    """
    queue_handler = threading.Thread(target=queueHandler)
    queue_handler.daemon = True
    queue_handler.start()

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    try:
        server_socket.bind((host, port))
    except OSError as e:
        if e.errno == errno.EADDRINUSE:
            pass

    server_socket.listen(5)
    print(f"Socket server listening on {host}:{port}")
    acceptConnections(server_socket)
