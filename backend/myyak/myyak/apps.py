from django.apps import AppConfig
from threading import Thread

class MainAppConfig(AppConfig):
    name = 'myyak'

    def ready(self):
        if not hasattr(self, 'already_run'):
            self.already_run = True
            import socket_server # 순환 참조를 피하기 위해 여기에서 임포트
            socket_server_thr = Thread(target=socket_server.startServer, args=('', 65432))
            socket_server_thr.daemon = True
            socket_server_thr.start()
