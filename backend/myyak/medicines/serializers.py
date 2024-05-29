from rest_framework import serializers
from .models import *

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'
        read_only_fields = ('med_ingr',)


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ('pre_ingr',)

class UsedSerializer(serializers.ModelSerializer):
    pre_name = serializers.CharField(source='pre_id.pre_name', read_only=True)

    class Meta:
        model = Used
        fields = '__all__'
        read_only_fields = ('user_id', 'pre_id',)
