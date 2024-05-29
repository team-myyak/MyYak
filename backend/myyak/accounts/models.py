from django.db import models
from django.contrib.auth.models import AbstractUser
from allauth.account.adapter import DefaultAccountAdapter

# Create your models here.
class User(AbstractUser):
    user_quit_dttm = models.DateTimeField(blank=True, null=True, db_comment='탈퇴 일시')
    user_realname = models.CharField(max_length=100, db_comment='실명')

    first_name = None
    last_name = None

class CustomAccountAdapter(DefaultAccountAdapter):
    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """
        from allauth.account.utils import user_email, user_field, user_username

        data = form.cleaned_data
        # first_name = data.get("first_name")
        # last_name = data.get("last_name")
        email = data.get("email")
        username = data.get("username")
        user_realname = data.get("user_realname")

        user_email(user, email)
        user_username(user, username)
        # if first_name:
        #     user_field(user, "first_name", first_name)
        # if last_name:
        #     user_field(user, "last_name", last_name)
        if user_realname:
            user_field(user, "user_realname", user_realname)
        if "password1" in data:
            user.set_password(data["password1"])
        else:
            user.set_unusable_password()
        self.populate_username(request, user)
        if commit:
            # Ability not to commit makes it easier to derive from
            # this adapter by adding
            user.save()
        return user