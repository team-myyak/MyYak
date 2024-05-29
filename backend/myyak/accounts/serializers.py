from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.utils import get_username_max_length
from allauth.account.adapter import get_adapter
from .models import User
from dj_rest_auth.registration.serializers import RegisterSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CustomRegisterSerializer(RegisterSerializer):
    user_realname = serializers.CharField(max_length=100, required=True)

    def get_cleaned_data(self):
        data_dict = super().get_cleaned_data()
        data_dict['user_realname'] = self.validated_data.get('user_realname', '')
        return data_dict

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        self.custom_signup(request, user)
        user.save()
        return user
