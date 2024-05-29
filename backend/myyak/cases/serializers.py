from rest_framework import serializers
from .models import Case, Slot, SlotLog, UserCase, Bookmark
from medicines.serializers import *

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = '__all__'

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'
        read_only_fields = ('case_id',)

class SlotLogSerializer(serializers.ModelSerializer):
    med_name = serializers.CharField(source='med_id.med_name', read_only=True)
    med_vendor = serializers.CharField(source='med_id.med_vendor', read_only=True)
    med_method = serializers.CharField(source='med_id.med_method', read_only=True)
    med_efficiency = serializers.CharField(source='med_id.med_efficiency', read_only=True)
    med_interaction = serializers.CharField(source='med_id.med_interaction', read_only=True)

    class Meta:
        model = SlotLog
        fields = '__all__'
        read_only_fields = ('user_id', 'slot_id', 'med_id',)

class UserCaseSerializer(serializers.ModelSerializer):
    case_sn = serializers.CharField(source='case_id.case_sn', read_only=True)
    class Meta:
        model = UserCase
        fields = '__all__'
        read_only_fields = ('user_id', 'case_id',)

class BookmarkSerializer(serializers.ModelSerializer):
    med_name = serializers.CharField(default='default')
    
    class Meta:
        model = Bookmark
        fields = '__all__'
        read_only_fields = ('user_id', 'slot_id',)
