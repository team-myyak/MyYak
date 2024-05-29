from rest_framework import serializers
from .models import *

class NoticeSerializer(serializers.ModelSerializer):
    slot_exp = serializers.DateField(source='slot_log_id.slot_exp', read_only=True)
    class Meta:
        model = Notice
        fields = '__all__'
        read_only_fields = ('user_id', 'slot_log_id')
