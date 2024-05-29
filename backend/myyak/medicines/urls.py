from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('search', views.search),
    path('used/', views.used),
    path('used/search/', views.usedSearch)
]
