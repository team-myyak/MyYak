from rest_framework.response import Response
from rest_framework import status

WRONG_REQUEST = Response({'message': 'Wrong request.'}, status=status.HTTP_400_BAD_REQUEST)
UNKNOWN_ERROR = Response({'message': 'Unknown error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
CASE_NOT_ONLINE = Response({'message': 'Case not online.'}, status=status.HTTP_404_NOT_FOUND)

