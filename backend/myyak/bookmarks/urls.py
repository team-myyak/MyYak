from django.urls import path
from . import views

urlpatterns = [
    path('', views.bookmarks, name='update_bookmarks'),
]