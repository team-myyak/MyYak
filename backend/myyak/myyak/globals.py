from queue import Queue
import threading
SOCKET_SERVER_QUEUE = Queue()
DEVICE_FEEDBACK_MAP = dict()
condition = threading.Condition()
