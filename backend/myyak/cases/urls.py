from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('newcase/', views.newCase),
    path('', views.register),
    path('reset/', views.reset),
    path('slot/', views.slot),
    path('mycase/', views.mycase),
    path('list/', views.slotList),
    path('slot/info/', views.slotInfo),
    path('book/', views.bookList),
    path('slot/search/', views.slotSearch),
    path('med/', views.med)
]
